$ErrorActionPreference = "Stop"

Write-Host "Installing Capacitor Core..."
npm install @capacitor/core @capacitor/android

Write-Host "Installing Capacitor CLI..."
npm install -D @capacitor/cli

Write-Host "Initializing Capacitor..."
npx cap init "Spell Steps" com.kiranmayee.spellsteps --web-dir dist

Write-Host "Building web project..."
npm run build

Write-Host "Adding Android platform..."
npx cap add android

Write-Host "Syncing Android project..."
npx cap sync

Write-Host "Android setup complete!"
