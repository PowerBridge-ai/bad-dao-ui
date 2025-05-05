import axios from 'axios';

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

const API_URL = 'https://api.elevenlabs.io/v1';
let API_KEY = '';
// Keep track of the current audio source
let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioContext: AudioContext | null = null;

// Initialize the service with API key
export const initElevenLabsService = (apiKey: string): void => {
  API_KEY = apiKey;
};

// Get available voices
export const getVoices = async (): Promise<Voice[]> => {
  try {
    if (!API_KEY) {
      console.error('ElevenLabs API key not set. Call initElevenLabsService first.');
      return [];
    }

    const response = await axios.get(`${API_URL}/voices`, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return response.data.voices || [];
  } catch (error) {
    console.error('Error fetching 11Labs voices:', error);
    return [];
  }
};

// Text to speech conversion
export const textToSpeech = async (options: TextToSpeechOptions): Promise<ArrayBuffer | null> => {
  try {
    if (!API_KEY) {
      console.error('ElevenLabs API key not set. Call initElevenLabsService first.');
      return null;
    }

    const { text, voice_id, model_id = 'eleven_monolingual_v1', voice_settings } = options;

    const response = await axios.post(
      `${API_URL}/text-to-speech/${voice_id}`,
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
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating speech with 11Labs:', error);
    return null;
  }
};

// Play audio from ArrayBuffer
export const playAudio = async (audioData: ArrayBuffer): Promise<void> => {
  // Stop any currently playing audio first
  stop();
  
  currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await currentAudioContext.decodeAudioData(audioData);
  
  currentAudioSource = currentAudioContext.createBufferSource();
  currentAudioSource.buffer = audioBuffer;
  currentAudioSource.connect(currentAudioContext.destination);
  currentAudioSource.start(0);
  
  // Set up onended to clean up resources
  currentAudioSource.onended = () => {
    currentAudioSource = null;
  };
};

// Stop currently playing audio
export const stop = (): void => {
  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
    } catch (error) {
      // Ignore errors if already stopped
      console.warn('Error stopping audio:', error);
    }
    currentAudioSource = null;
  }
  
  // Close audio context to free up resources
  if (currentAudioContext && currentAudioContext.state !== 'closed') {
    try {
      currentAudioContext.close();
    } catch (error) {
      console.warn('Error closing audio context:', error);
    }
    currentAudioContext = null;
  }
};

// Speak text directly
export const speak = async (text: string, voice_id: string): Promise<boolean> => {
  try {
    const audioData = await textToSpeech({ text, voice_id });
    
    if (audioData) {
      await playAudio(audioData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error speaking text:', error);
    return false;
  }
};

// Get a default voice if none is specified
export const getDefaultVoice = async (): Promise<string> => {
  const voices = await getVoices();
  // Default to first voice, or Rachel if available
  const defaultVoice = voices.find(v => v.name === 'Rachel') || voices[0];
  return defaultVoice?.voice_id || '';
};

// Test API key validity
export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/voices`, {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    return !!response.data.voices;
  } catch (error) {
    console.error('Invalid 11Labs API key:', error);
    return false;
  }
};

export default {
  initElevenLabsService,
  getVoices,
  textToSpeech,
  playAudio,
  speak,
  getDefaultVoice,
  testApiKey,
  stop
}; 