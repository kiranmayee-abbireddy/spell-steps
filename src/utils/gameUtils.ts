import { Character, Stone } from '../types/gameTypes';

/**
 * Formats seconds into MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '∞';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Calculates score based on word length and complexity
 */
export const calculateWordScore = (word: string): number => {
  const length = word.length;
  
  // Base score calculation
  let score = Math.pow(length, 1.5); // Square root gives more balanced progression
  
  // Bonus for longer words
  if (length >= 6) score *= 1.5;
  if (length >= 8) score *= 1.2;
  
  // Bonus for uncommon letters (J, K, Q, X, Z)
  const uncommonLetters = ['j', 'k', 'q', 'x', 'z'];
  for (const letter of word.toLowerCase()) {
    if (uncommonLetters.includes(letter)) {
      score *= 1.2; // 20% bonus per uncommon letter
    }
  }
  
  return Math.round(score);
};

/**
 * Generates a stone object based on the word
 */
export const generateStoneFromWord = (
  word: string, 
  stoneCount: number,
  score: number
): Stone => {
  const id = `stone-${stoneCount}-${word}`;
  const length = word.length;
  
  // Special stone for longer or high-scoring words
  const isSpecial = length >= 6 || score >= 20;
  
  // Stone size based on word length (minimum 3, maximum 12)
  const size = Math.min(12, Math.max(3, length * 1.2));
  
  // Calculate position (distance from start) based on stone count
  // Each stone is placed further along the river
  const basePosition = stoneCount * 8;
  const position = basePosition + Math.random() * 4; // Add slight randomness
  
  return {
    id,
    word,
    position,
    size,
    special: isSpecial
  };
};

/**
 * Returns a random character from the available characters
 */
export const getRandomCharacter = (characters: Character[]): Character => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};