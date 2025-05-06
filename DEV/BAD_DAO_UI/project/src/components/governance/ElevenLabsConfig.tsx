import React, { useState, useEffect } from 'react';
import { X, Check, Info } from 'lucide-react';

interface Voice {
  voice_id: string;
  name: string;
}

interface ElevenLabsConfigProps {
  onClose: () => void;
  onSave: (apiKey: string, voiceId: string) => void;
  apiKey?: string;
  selectedVoiceId?: string;
}

const ElevenLabsConfig: React.FC<ElevenLabsConfigProps> = ({
  onClose,
  onSave,
  apiKey = '',
  selectedVoiceId = ''
}) => {
  const [key, setKey] = useState(apiKey);
  const [voiceId, setVoiceId] = useState(selectedVoiceId);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Default voices to display before API key is provided
  const defaultVoices: Voice[] = [
    { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
    { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
    { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
    { voice_id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli' },
    { voice_id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },
    { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold' },
    { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
    { voice_id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam' }
  ];
  
  // Load voices if API key is provided
  useEffect(() => {
    if (key) {
      fetchVoices();
    } else {
      setVoices(defaultVoices);
    }
  }, [key]);
  
  // Fetch voices from the ElevenLabs API
  const fetchVoices = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': key
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch voices. Please check your API key.');
      }
      
      const data = await response.json();
      setVoices(data.voices || []);
    } catch (err) {
      console.error('Error fetching voices:', err);
      setError('Failed to fetch voices. Please check your API key.');
      setVoices(defaultVoices);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (!key) {
      setError('API key is required');
      return;
    }
    
    if (!voiceId) {
      setError('Please select a voice');
      return;
    }
    
    onSave(key, voiceId);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-dark rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Voice Configuration</h2>
            <button 
              className="text-neutral-light hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-md flex items-start">
              <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">ElevenLabs API Key</label>
              <input 
                type="password"
                className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your ElevenLabs API key"
              />
              <p className="text-xs text-neutral-light mt-1">
                Get your API key from <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ElevenLabs dashboard</a>
              </p>
            </div>
            
            <div>
              <label className="block text-white mb-2">Select Voice</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  voices.map((voice) => (
                    <div 
                      key={voice.voice_id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        voiceId === voice.voice_id ? 'bg-primary/20 border border-primary/50' : 'hover:bg-neutral-light/5 border border-transparent'
                      }`}
                      onClick={() => setVoiceId(voice.voice_id)}
                    >
                      <div className={`w-4 h-4 rounded-full border ${
                        voiceId === voice.voice_id ? 'border-primary bg-primary' : 'border-neutral-light'
                      } flex items-center justify-center mr-2`}>
                        {voiceId === voice.voice_id && <Check size={12} />}
                      </div>
                      <span className="text-white">{voice.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="px-4 py-2 bg-neutral-light/10 hover:bg-neutral-light/20 text-white rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md flex items-center"
              onClick={handleSave}
            >
              <Check size={16} className="mr-1" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevenLabsConfig; 