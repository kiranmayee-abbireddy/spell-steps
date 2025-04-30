// Game types

export type GameMode = 'casual' | 'timed';
export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export interface Character {
  id: string;
  name: string;
  sprite: string; // This would be a path to the sprite or an emoji
  walkSpeed: number;
}

export interface Stone {
  id: string;
  word: string;
  position: number;
  size: number; // Size is based on word length/quality
  special?: boolean; // If it's a power-up stone
}

export interface WordHistory {
  word: string;
  timestamp: number;
  points: number;
  special?: boolean;
}

export interface SoundEffect {
  name: string;
  src: string;
}