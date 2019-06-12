import React from "react";
import { StyleSheet } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { Engine as Renderer, Scene, Color3 } from "babylonjs";
import { GLView } from "expo-gl";
import Systems from "./systems";
import Entities from "./entities";
import { getInfoAsync, readAsStringAsync } from 'expo-file-system'
import { resolveAsync } from 'expo-asset-utils';

global.HTMLElement = () => false; 
global.HTMLImageElement = () => false; 
global.Image = () => ({ 
  addEventListener(...args) { console.log("Image.addEventListener - I should not get here..", args) },
  removeEventListener(...args) { console.log("Image.removeEventListener - I should not get here..", args) }
 }); 

Renderer._TextureLoaders.push({
  canLoad(...args) {
    return true;
  },
  transformUrl(url) { console.log("transformUrl: ", url);  return url; },
  loadData(data, texture, cb) {
    //-- https://github.com/BabylonJS/Babylon.js/blob/f3b4098c0f3f00f7f3993494bf833af266160b1b/src/Materials/Textures/Loaders/tgaTextureLoader.ts
    //-- https://github.com/BabylonJS/Babylon.js/blob/f3b4098c0f3f00f7f3993494bf833af266160b1b/src/Misc/tga.ts
    //-- https://github.com/BabylonJS/Babylon.js/search?q=_prepareWebGLTexture&unscoped_q=_prepareWebGLTexture
    //-- https://github.com/gre/webgltexture-loader/blob/master/packages/webgltexture-loader-expo/src/ExpoModuleTextureLoader.js
    resolveAsync(texture.url)
      .then(asset => {
        console.log("asset", asset)
        cb(asset.width, asset.height, texture.generateMipMaps, false, () => {
          console.log("DONE")
        })
      })
    //readAsStringAsync(texture.url, { encoding: "Base64" }).then(console.log)
    //AssetUtils.resolveAsync(texture.url).then(obj => readAsStringAsync(obj.uri, { encoding: "Base64" })).then(console.log)
  }
});

class Game extends React.Component {

  onContextCreate = gl => {
    this.gl = gl;
    this.renderer = new Renderer(gl, true);
    this.renderer._prepareWebGLTexture = () => console.log("MONKEY PATCH DELUXE!!");
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
