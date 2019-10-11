import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import Game from "./game";

class App extends React.Component {
  render() {
    return (
      <Game />
    );
  }
}

registerRootComponent(App);
