# taco-cat
Keep a tally of tacos eaten, compete with your friends, earn achievements

See it live: https://tacogato.app/

taco-gato.keystore

Keystore password: tacogato

What is your first and last name?
  [Unknown]:  Daniel Ryan
What is the name of your organizational unit?
  [Unknown]:
What is the name of your organization?
  [Unknown]:
What is the name of your City or Locality?
  [Unknown]:  Boise
What is the name of your State or Province?
  [Unknown]:  Idaho
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=Daniel Ryan, OU=Unknown, O=Unknown, L=Boise, ST=Idaho, C=US correct?
  [no]:  yes

## Android release

> $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/danielryan/Development/taco-gato/taco-gato.keystore /Users/danielryan/Development/taco-gato/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk taco-gato
> $ cd /Users/danielryan/Development/taco-gato/platforms/android/app/build/outputs/apk/release/
> $ ~/Library/Android/sdk/build-tools/28.0.0/zipalign -v 4 app-release-unsigned.apk app-release.apk
