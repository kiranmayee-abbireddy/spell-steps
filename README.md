# Spell Steps 🐸✨

Welcome to **Spell Steps**! A magical word-typing and bridge-building game where you must type words to help Hoppy safely cross the river before night falls.

![Game Mockup](public/mockup.png)

## Overview 🌟

**Spell Steps** started as a fast-paced interactive web game and has now been fully ported to Android as a native app using powerful tools like React, Vite, and Capacitor! Collect gems, climb levels, earn a high score, and learn new words across ever-increasing difficulties.

## Features ✨

* **Dynamic Word Fetching:** Words fall from the sky; type them fast to build stepping stones!
* **Dictionary API Support:** Comprehensive dictionary fallback validating and checking meanings.
* **Progressive Difficulty:** Experience harder words and faster challenges as your level increases.
* **Special Words & Gems:** Some words are enchanted, unlocking special stones and magical gems.
* **Sound & Animation Effects:** Engaging particle effects and lovely sound scapes that draw you in.
* **Cross-Platform:** Available as an immersive web application and a native Android application out of the box!

## Getting Started 🚀

### Running the Web Version
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Android
1. Build the Android-specific target configuration:
   ```bash
   npm run build:android
   ```
2. Sync the Capacitor assets:
   ```bash
   npx cap sync
   ```
3. Open the Android project in your local Android Studio or run the command line builder:
   ```bash
   cd android
   .\gradlew assembleDebug
   ```

## Technologies Used 💻
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Capacitor (for Android native packaging)
- React Three Fiber / Drei (for 3D scene backgrounds & magic rendering)
- Sharp (for app icon and splash screen generation)

## License 📜
All rights reserved ©. Enjoy the steps!
