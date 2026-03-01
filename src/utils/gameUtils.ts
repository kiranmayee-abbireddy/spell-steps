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
  lastPosition: number,
  score: number,
  stoneCount: number,
  targetPosition: number = 100
): Stone => {
  const id = `stone-${stoneCount}-${word}`;
  const length = word.length;

  // Special stone for longer or high-scoring words
  const isSpecial = length >= 6 || score >= 20;

  // Determine 3D radius based directly on word length (longer word = wider stone)
  const radius3D = Math.max(0.6, Math.min(2.5, 0.4 + length * 0.15));

  // Small but guaranteed gap in 3D space to prevent overlap
  const gap3D = 0.3 + Math.random() * 0.2;

  // Calculate 3D distance between this center and last Center
  const distance3D = (radius3D * 2) + gap3D;

  // Game coordinates map 20 3D units horizontally between banks
  // Scale the 3D unit distance to game coordinates based on current targetPosition
  const distanceCoveredInGameUnits = distance3D * (targetPosition / 20);

  const position = lastPosition + distanceCoveredInGameUnits;

  return {
    id,
    word,
    position,
    size: radius3D, // Save precise 3D radius instead of arbitrary length multiple
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