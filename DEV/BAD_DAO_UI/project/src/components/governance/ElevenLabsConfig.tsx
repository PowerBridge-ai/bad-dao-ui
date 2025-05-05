import React, { useState, useEffect } from 'react';
import { X, Volume2, Check } from 'lucide-react';
import elevenlabsService, { Voice } from '../../services/elevenlabsService';

interface ElevenLabsConfigProps {
  onClose: () => void;
  onSave: (apiKey: string, selectedVoiceId: string) => void;
  apiKey: string;
  selectedVoiceId: string;
}

const ElevenLabsConfig: React.FC<ElevenLabsConfigProps> = ({ 
  onClose, 
  onSave,
  apiKey: initialApiKey,
  selectedVoiceId: initialVoiceId
}) => {
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState(initialVoiceId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Load voices if API key is already set
    if (apiKey) {
      validateAndLoadVoices(apiKey);
    }
  }, []);

  const validateAndLoadVoices = async (key: string) => {
    setIsLoading(true);
    try {
      const isValid = await elevenlabsService.testApiKey(key);
      setIsValid(isValid);
      
      if (isValid) {
        elevenlabsService.initElevenLabsService(key);
        const voiceList = await elevenlabsService.getVoices();
        setVoices(voiceList);
        
        // Set default voice if not already set
        if (!selectedVoiceId && voiceList.length > 0) {
          setSelectedVoiceId(voiceList[0].voice_id);
        }
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsValid(false);
  };

  const handleVerifyClick = () => {
    if (apiKey) {
      validateAndLoadVoices(apiKey);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const handleTestVoice = async (voiceId: string) => {
    if (apiKey && voiceId) {
      setTestMessage('Testing voice...');
      try {
        const success = await elevenlabsService.speak(
          'Hello, this is a test of my voice for the BAD DAO contract builder.',
          voiceId
        );
        
        setTestMessage(success ? 'Voice test successful!' : 'Voice test failed');
        setTimeout(() => setTestMessage(''), 3000);
      } catch (error) {
        console.error('Error testing voice:', error);
        setTestMessage('Voice test failed');
        setTimeout(() => setTestMessage(''), 3000);
      }
    }
  };

  const handleSave = () => {
    if (apiKey && selectedVoiceId) {
      onSave(apiKey, selectedVoiceId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1c1e2a] rounded-lg w-full max-w-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">ElevenLabs Voice Configuration</h2>
          <button onClick={onClose} className="text-neutral-light hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-light mb-1">
              API Key
            </label>
            <div className="flex">
              <input
                type="password"
                value={apiKey}
                onChange={handleKeyChange}
                placeholder="Enter your ElevenLabs API key"
                className="flex-grow bg-neutral/50 border border-neutral-light/30 rounded-l-lg p-2 text-white"
              />
              <button
                onClick={handleVerifyClick}
                disabled={!apiKey || isLoading}
                className={`px-4 rounded-r-lg flex items-center justify-center ${
                  isValid ? 'bg-green-600' : 'bg-primary'
                } disabled:bg-neutral-light/30`}
              >
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : isValid ? (
                  <Check size={18} />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            {isValid && <p className="text-green-500 text-xs mt-1">API key is valid</p>}
          </div>

          {isValid && voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-2">
                Select Voice
              </label>
              <div className="max-h-40 overflow-y-auto border border-neutral-light/30 rounded-lg">
                {voices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className={`flex items-center justify-between p-3 hover:bg-neutral-light/10 cursor-pointer ${
                      selectedVoiceId === voice.voice_id ? 'bg-primary/20' : ''
                    }`}
                    onClick={() => handleVoiceSelect(voice.voice_id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        selectedVoiceId === voice.voice_id ? 'bg-primary' : 'bg-neutral-light/30'
                      }`} />
                      <span>{voice.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestVoice(voice.voice_id);
                      }}
                      className="text-neutral-light hover:text-primary"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {testMessage && (
                <p className="text-primary text-xs mt-1">{testMessage}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-light/30 rounded-lg text-white hover:bg-neutral-light/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid || !selectedVoiceId}
              className="px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary/80 disabled:bg-neutral-light/30"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevenLabsConfig; 