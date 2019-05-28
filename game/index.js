import React from "react";
import { PixelRatio } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { Engine as Renderer, Scene, Color3 } from "babylonjs";
import { GLView } from "expo";
import Entities from "./entities";

global.HTMLElement = () => false; 

class Game extends React.Component {

  onContextCreate = gl => {
    const scale = PixelRatio.get();
    const width = gl.drawingBufferWidth / scale;
    const height = gl.drawingBufferHeight / scale;

    this.gl = gl;
    this.renderer = new Renderer(gl, true);
    this.scene = new Scene(this.renderer);
    this.scene.createDefaultLight();
    this.scene.clearColor = Color3.Black();
    this.refs.engine.swap(Entities(this.scene));

    console.log(`${width}, ${height}, ${scale}, ${this.renderer.getRenderHeight()}`);
  }

  componentWillUnmount() {
    GLView.destroyContextAsync(this.gl)
  }

  render() {
    return (
      <GameEngine
        ref={"engine"}
        renderer={() => {
          if (this.renderer && this.scene && this.gl) {
            this.renderer.beginFrame();
            this.scene.render();
            this.renderer.endFrame();
            this.gl.endFrameEXP();
          }
        }}
      >
        <GLView onContextCreate={this.onContextCreate} />
      </GameEngine>
    );
  }
}

export default Game;
