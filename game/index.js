import React from "react";
import { StyleSheet } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { Engine as Renderer, Scene, Color3, Tools } from "babylonjs";
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







function _prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode) {
    console.log("_prepareWebGLTextureContinuation")
    var gl = this._gl;
    if (!gl) {
        return;
    }

    var filters = this._getSamplingParameters(samplingMode, !noMipmap);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);

    if (!noMipmap && !isCompressed) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    this._bindTextureDirectly(gl.TEXTURE_2D, null);

    // this.resetTextureCache();
    if (scene) {
        scene._removePendingData(texture);
    }

    texture.onLoadedObservable.notifyObservers(texture);
    texture.onLoadedObservable.clear();
}


function _prepareWebGLTexture(texture, scene, width, height, invertY, noMipmap, isCompressed,
        processFunction, samplingMode = Renderer.TEXTURE_TRILINEAR_SAMPLINGMODE) {
        var maxTextureSize = this.getCaps().maxTextureSize;
        var potWidth = Math.min(maxTextureSize, this.needPOTTextures ? Tools.GetExponentOfTwo(width, maxTextureSize) : width);
        var potHeight = Math.min(maxTextureSize, this.needPOTTextures ? Tools.GetExponentOfTwo(height, maxTextureSize) : height);

        console.log("_prepareWebGLTexture", texture.asset)

        var gl = this._gl;
        if (!gl) {
            return;
        }

        if (!texture._webGLTexture) {
            //  this.resetTextureCache();
            if (scene) {
                scene._removePendingData(texture);
            }

            return;
        }

        this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
        this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));

        

        gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.asset
      );

        

        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = potWidth;
        texture.height = potHeight;
        texture.isReady = true;

        console.log("about to call processFunction");

        if (processFunction(potWidth, potHeight, () => {
            this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
        })) {
            // Returning as texture needs extra async steps
            console.log("Get here homie..")
            return;
        }

        console.log("Nah im here..")
        this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
    }





















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
        texture.asset = asset;
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
    this.renderer._prepareWebGLTexture = _prepareWebGLTexture;
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
