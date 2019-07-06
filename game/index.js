import React from "react";
import { StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Renderer from "./graphics/renderer";
import Systems from "./systems";
import Entities from "./entities";

class Game extends React.Component {
  render() {
    return (
      <GameEngine
        ref={"engine"}
        systems={Systems}
        entities={Entities()}
        renderer={Renderer()}
      />
    );
  }
}

export default Game;
