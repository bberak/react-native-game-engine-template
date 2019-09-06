# React Native Game Engine Template

This repo is designed to be a sort of game kickstarter. It contains some general systems and components that should be somewhat useful when developing a variety of games using [React Native Game Engine](https://github.com/bberak/react-native-game-engine).

The underlying renderer is [ThreeJS](https://github.com/mrdoob/three.js) which has been extended with [Expo-Three](https://github.com/expo/expo-three).

The template will contain both 3D and 2D game entities (sprites) and potentially some particles.

This project uses [Expo](https://expo.io) because quite frankly, it is the easiest and most stable way to get up and running with a React Native project for both iOS and Android with all the OpenGL/WebGL goodness ready to go out of the box.

## How to start

Firstly, clone the repo and configure git tracking:

```
git clone https://github.com/bberak/react-native-game-engine-template.git [new-game]

cd [new-game]

rm -rf .git # Windows: rmdir /S .git

git init

git add .

git commit -m "First commit"

git remote add origin https://github.com/[you]/[new-game].git

git push -u origin master

```

Then, install the dependencies and start the app:

```
npm install

npm install -g expo-cli

npm run start
```

This template contains the following:

- Stick (Gamepad) controllers
- A simple HUD
- Particle systems
- Sound support
- Physics implementation powered by [Oimo](https://github.com/lo-th/Oimo.js/)
- [ThreeJS](https://github.com/mrdoob/three.js) rendering
- Post-processing effects
- Sprite support with animations

> All of the above systems and components are hackable and extensible - which *should* allow for quick[er] prototyping.
