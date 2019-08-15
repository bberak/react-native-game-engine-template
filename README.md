# React Native Game Engine Template

This repo is designed to be a sort of game kickstarter. It contains some general systems and components that should be somewhat useful when developing a variety of games using [React Native Game Engine](https://github.com/bberak/react-native-game-engine).

The underlying renderer is [ThreeJS](https://github.com/mrdoob/three.js) which has been extended with [Expo-Three](https://github.com/expo/expo-three).

The template will contain both 3D and 2D game entities (sprites) and potentially some particles.

This project uses [Expo](https://expo.io) because quite frankly, it is the easiest and most stable way to get up and running with a React Native project for both iOS and Android with all the OpenGL/WebGL goodness ready to go out of the box.

## How to start

Firstly, clone the repo and setup git:

```
git clone https://github.com/bberak/react-native-game-engine-template.git

mv react-native-game-engine-template my-game && cd my-game

rm -rf .git

git init

git add .

git commit -m "First commit"

git remote add origin https://github.com/me/my-game.git

git push origin master

```

Then install dependencies and start:

```
npm install

npm install -g expo-cli

npm run start
```