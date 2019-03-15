#!/bin/bash

echo "Signing the unsigned APK"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./taco-gato.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk taco-gato

echo "Change Directory to /release"
cd ./platforms/android/app/build/outputs/apk/release/

echo "Removing old signed APK"
rm app-release.apk

echo "Generating a new Signed APK"
~/Library/Android/sdk/build-tools/28.0.0/zipalign -v 4 app-release-unsigned.apk app-release.apk

echo "Copying path to Clipboard"
pwd | pbcopy
