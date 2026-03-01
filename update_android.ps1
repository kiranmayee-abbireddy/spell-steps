Write-Host "Building web project for Android..."
npm run build:android

Write-Host "Syncing Android project..."
npx cap sync

Write-Host "Building APK..."
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
cd android
.\gradlew assembleDebug

Write-Host "Android update complete! APK generated at build\outputs\apk\debug\app-debug.apk"
