// Map of sound effects
const sounds: Record<string, HTMLAudioElement> = {};

// Sound URLs
const soundUrls: Record<string, string> = {
  background: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3',
  step: 'https://assets.mixkit.co/active_storage/sfx/650/650-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  special: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  invalid: 'https://assets.mixkit.co/active_storage/sfx/223/223-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/957/957-preview.mp3'
};

/**
 * Preloads all sound effects
 */
export const preloadSounds = (): void => {
  Object.entries(soundUrls).forEach(([key, url]) => {
    const audio = new Audio();
    audio.src = url;
    audio.volume = key === 'background' ? 0.1 : 0.5; // Background music much quieter
    sounds[key] = audio;
  });
};

/**
 * Plays a sound effect
 */
export const playSound = (name: string): void => {
  // Initialize sounds if not already done
  if (Object.keys(sounds).length === 0) {
    preloadSounds();
  }

  // Get the sound or log error if not found
  const sound = sounds[name];
  if (!sound) {
    console.error(`Sound "${name}" not found`);
    return;
  }

  // If background music, loop it
  if (name === 'background') {
    sound.loop = true;
    
    // Only play if not already playing
    if (sound.paused) {
      sound.play().catch(error => {
        console.error('Error playing background sound:', error);
      });
    }
    return;
  }

  // For other sounds, play from the beginning
  sound.currentTime = 0;
  sound.play().catch(error => {
    console.error(`Error playing sound "${name}":`, error);
  });
};

/**
 * Stops a sound effect
 */
export const stopSound = (name: string): void => {
  const sound = sounds[name];
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
};

// Preload sounds when module is imported
preloadSounds();