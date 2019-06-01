import React from "react";
import { StyleSheet } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { Engine as Renderer, Scene, Color3 } from "babylonjs";
import { GLView } from "expo";
import Systems from "./systems";
import Entities from "./entities";

global.HTMLElement = () => false; 

class Game extends React.Component {

  onContextCreate = gl => {
    this.gl = gl;
    this.renderer = new Renderer(gl, true);
    this.scene = new Scene(this.renderer);
    this.scene.createDefaultLight();
    this.scene.clearColor = Color3.Blue();
    this.refs.engine.swap(Entities(this.scene));
  }

  componentWillUnmount() {
    GLView.destroyContextAsync(this.gl)
  }

  render() {
    return (
      <GameEngine
        ref={"engine"}
        systems={Systems}
        renderer={() => {
          if (this.renderer && this.scene && this.gl) {
            this.renderer.beginFrame();
            this.scene.render();
            this.renderer.endFrame();
            this.gl.endFrameEXP();
          }
        }}
      >
        <GLView onContextCreate={this.onContextCreate} style={StyleSheet.absoluteFill} />
      </GameEngine>
    );
  }
}

export default Game;
