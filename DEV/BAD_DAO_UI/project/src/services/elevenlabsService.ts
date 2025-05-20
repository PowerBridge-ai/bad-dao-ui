import axios, { AxiosError } from 'axios';
import { createLogger } from '../utils/logger';

// Types for 11Labs API
export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface TextToSpeechOptions {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
}

// Create a service-specific logger
const logger = createLogger('ELEVENLABS_SERVICE');

class ElevenLabsService {
  private apiKey: string = '';
  private baseUrl: string = 'https://api.elevenlabs.io/v1';
  private audioContext: AudioContext | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private audioQueue: HTMLAudioElement[] = [];
  private isPlaying: boolean = false;

  constructor() {
    logger.debug('🏗️', 'ElevenLabs service initializing');
    
    // Initialize AudioContext lazily when needed
    try {
      window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    } catch (error) {
      logger.error('❌', 'AudioContext not supported in this browser', error);
    }
  }

  public initElevenLabsService(apiKey: string): void {
    logger.info('🔑', 'Initializing ElevenLabs service with API key');
    this.apiKey = apiKey;
    localStorage.setItem('elevenlabsApiKey', apiKey);
  }

  public async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      // Try a simple request to validate the API key
      const response = await axios.get(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      return response.status === 200;
    } catch (error) {
      console.warn('ElevenLabs API key validation failed:', error);
      return false;
    }
  }

  public async speak(text: string, voiceId: string = 'pFZP5JQG7iQjIQuC4Bku'): Promise<void> {
    logger.group('Speech Synthesis');
    logger.voice('🎙️', 'Starting speech synthesis', { textLength: text.length, voiceId });
    
    if (!this.apiKey) {
      logger.error('❌', 'API key not set - call initElevenLabsService first');
      logger.groupEnd();
      throw new Error('API key not set - call initElevenLabsService first');
    }

    try {
      // Create audio context if it doesn't exist or if it's closed
      if (!this.audioContext || this.audioContext.state === 'closed') {
        logger.debug('🔊', 'Creating new AudioContext');
        this.audioContext = new AudioContext();
      }

      // Resume audio context if it's suspended
      if (this.audioContext.state === 'suspended') {
        logger.debug('🔊', 'Resuming suspended AudioContext');
        await this.audioContext.resume();
      }

      // Make request to ElevenLabs API
      logger.api('📡', 'Making request to ElevenLabs API', {
        endpoint: `${this.baseUrl}/text-to-speech/${voiceId}`,
        method: 'POST'
      });
      
      // Start performance timing
      logger.timeStart('ElevenLabs API Request');
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      logger.timeEnd('ElevenLabs API Request');

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('❌', `ElevenLabs API error: ${response.status}`, { 
          statusCode: response.status, 
          statusText: response.statusText,
          errorDetails: errorText 
        });
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      logger.success('✅', 'Received audio data from ElevenLabs API');
      
      // Get audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element and play
      const audio = new Audio(audioUrl);
      
      // Add event listeners for tracking playback
      audio.addEventListener('play', () => {
        logger.voice('▶️', 'Audio playback started');
        this.isPlaying = true;
      });
      
      audio.addEventListener('ended', () => {
        logger.voice('⏹️', 'Audio playback ended');
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        
        // Play next audio in queue if any
        if (this.audioQueue.length > 0) {
          logger.voice('⏭️', 'Playing next audio in queue');
          const nextAudio = this.audioQueue.shift();
          if (nextAudio) nextAudio.play();
        }
      });
      
      audio.addEventListener('error', (e) => {
        logger.error('❌', 'Audio playback error', e);
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      });

      // If already playing audio, queue this one
      if (this.isPlaying) {
        logger.voice('🔄', 'Adding audio to queue, already playing another audio');
        this.audioQueue.push(audio);
      } else {
        logger.voice('▶️', 'Starting audio playback');
        await audio.play();
      }
      
      logger.groupEnd();
      return Promise.resolve();
    } catch (error) {
      logger.error('❌', 'ElevenLabs service error', error);
      logger.groupEnd();
      return Promise.reject(error);
    }
  }

  public stop(): void {
    if (this.audioSource && this.isPlaying) {
      try {
        this.audioSource.stop();
      } catch (error) {
        console.warn('Error stopping audio:', error);
      }
      this.isPlaying = false;
      this.audioSource = null;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  // Get available voices
  public async getVoices(): Promise<Voice[]> {
    try {
      if (!this.apiKey) {
        console.error('ElevenLabs API key not set. Call initElevenLabsService first.');
        return [];
      }

      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      return response.data.voices || [];
    } catch (error) {
      console.error('Error fetching 11Labs voices:', error);
      return [];
    }
  }

  // Text to speech conversion
  public async textToSpeech(options: TextToSpeechOptions): Promise<ArrayBuffer | null> {
    if (!this.apiKey) {
      console.error('ElevenLabs API key not set. Call initElevenLabsService first.');
      return null;
    }

    try {
      const { text, voice_id, model_id = 'eleven_monolingual_v1', voice_settings } = options;

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voice_id}`,
        {
          text,
          model_id,
          voice_settings: voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      return response.data;
    } catch (error) {
      // Handle authentication errors
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        console.warn('Invalid ElevenLabs API key. Clearing stored key.');
        localStorage.removeItem('elevenlabsApiKey');
        this.apiKey = '';
      }
      
      console.error('Error generating speech with 11Labs:', error);
      return null;
    }
  }

  // Play audio from ArrayBuffer
  public async playAudio(audioData: ArrayBuffer): Promise<void> {
    // Stop any currently playing audio first
    this.stop();
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = audioBuffer;
      this.audioSource.connect(this.audioContext.destination);
      this.audioSource.start(0);
      this.isPlaying = true;
      
      // Set up onended to clean up resources
      this.audioSource.onended = () => {
        this.audioSource = null;
        this.isPlaying = false;
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      this.audioSource = null;
      this.isPlaying = false;
    }
  }

  // Get a default voice if none is specified
  public async getDefaultVoice(): Promise<string> {
    const voices = await this.getVoices();
    // Default to first voice, or Rachel if available
    const defaultVoice = voices.find(v => v.name === 'Rachel') || voices[0];
    return defaultVoice?.voice_id || '';
  }

  // Check if an API key exists and is likely valid
  public hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 10;
  }
}

const elevenlabsService = new ElevenLabsService();
export default elevenlabsService; 