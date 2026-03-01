Write-Host "Building web project for Android production..."
npm run build:android

Write-Host "Syncing Android project..."
npx cap sync

Write-Host "Building Release APK..."
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
cd android
.\gradlew assembleRelease

Write-Host "Android release build complete! The production APK is at android\app\build\outputs\apk\release\app-release.apk"
