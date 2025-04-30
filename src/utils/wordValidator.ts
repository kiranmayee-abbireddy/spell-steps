import { wordList } from '../data/dictionary';

/**
 * Validates if a word exists in our dictionary
 * First checks against local dictionary, then falls back to a free API
 */
export const isValidWord = async (word: string): Promise<boolean> => {
  // Immediately return false for invalid input
  if (!word || word.length < 2) return false;
  
  // Check if the word has already been used before
  // (This could be implemented by checking against state.words)
  
  // First try local dictionary (faster)
  if (wordList.includes(word.toLowerCase())) {
    return true;
  }
  
  try {
    // If not in local dictionary, use free dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    // If the response is ok (status in the range 200-299)
    return response.ok;
  } catch (error) {
    console.error('Error validating word:', error);
    
    // Fall back to local validation in case of network error
    // Accept words longer than 3 letters as valid
    return word.length >= 3;
  }
};