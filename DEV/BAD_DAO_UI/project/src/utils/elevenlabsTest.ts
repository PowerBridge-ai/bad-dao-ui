import elevenlabsService from '../services/elevenlabsService';

/**
 * This utility script allows testing the 11 Labs integration from the command line
 * 
 * Usage:
 * 1. Set your API key in the ELEVEN_LABS_API_KEY environment variable or replace it in the code
 * 2. Run with: tsx src/utils/elevenlabsTest.ts
 * 
 * Example output:
 * API Key: Valid
 * Available voices: 5
 * - Rachel (voice_id: 21m00Tcm4TlvDq8ikWAM)
 * - Domi (voice_id: AZnzlk1XvdvUeBnXmlld) 
 * - Bella (voice_id: EXAVITQu4vr4xnSDxMaL)
 * - Antoni (voice_id: ErXwobaYiN019PkySvjV)
 * - Elli (voice_id: MF3mGyEYCl7XYWbV9V6O)
 * 
 * Selected voice: Rachel (21m00Tcm4TlvDq8ikWAM)
 * Speech synthesis: Success
 */

const API_KEY = process.env.ELEVEN_LABS_API_KEY || '';

async function main() {
  try {
    // Test API key
    console.log('Testing 11 Labs API...');
    
    if (!API_KEY) {
      console.error('No API key provided. Set ELEVEN_LABS_API_KEY environment variable.');
      return;
    }
    
    // Initialize the service
    elevenlabsService.initElevenLabsService(API_KEY);
    
    // Test the API key
    const isValid = await elevenlabsService.testApiKey(API_KEY);
    console.log(`API Key: ${isValid ? 'Valid' : 'Invalid'}`);
    
    if (!isValid) {
      console.error('Invalid API key. Please check your credentials.');
      return;
    }
    
    // Get available voices
    const voices = await elevenlabsService.getVoices();
    console.log(`Available voices: ${voices.length}`);
    
    for (const voice of voices) {
      console.log(`- ${voice.name} (voice_id: ${voice.voice_id})`);
    }
    
    if (voices.length === 0) {
      console.log('No voices available. Check your API key permissions.');
      return;
    }
    
    // Select a voice (preferring Rachel if available)
    const selectedVoice = voices.find(v => v.name === 'Rachel') || voices[0];
    console.log(`\nSelected voice: ${selectedVoice.name} (${selectedVoice.voice_id})`);
    
    // Generate speech for browser environments
    if (typeof window !== 'undefined') {
      console.log('Generating speech...');
      const success = await elevenlabsService.speak(
        'This is a test of the Eleven Labs voice integration for the BAD DAO contract builder.',
        selectedVoice.voice_id
      );
      console.log(`Speech synthesis: ${success ? 'Success' : 'Failed'}`);
    } else {
      console.log('Speech generation skipped (requires browser environment)');
    }
    
  } catch (error) {
    console.error('Error testing 11 Labs integration:', error);
  }
}

// Run the test if executed directly
if (typeof window === 'undefined') {
  main();
} else {
  console.log('This utility is meant to be run from Node.js for testing.');
}

export default main; 