import React, { PureComponent } from "react";
import { Platform } from "react-native";
import ExpoGraphics from "expo-graphics-rnge";
import ExpoTHREE from "expo-three";
import suppressExpoWarnings from "expo-three/build/suppressWarnings";
import * as THREE from "three";
import _ from "lodash";
import { EffectComposer }  from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

suppressExpoWarnings();

class ThreeView extends PureComponent {

  onShouldReloadContext = () => {
    return Platform.OS === "android";
  };

  onContextCreate = async ({ gl, canvas, width, height, scale: pixelRatio }) => {
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });
    this.renderer.setClearColor(0x020202, 1.0);
    this.gl = gl;
    this.composer = new EffectComposer(this.renderer);

    const passes = [
      new RenderPass(this.props.scene, this.props.camera),
      ...this.props.passes
    ];

    passes.forEach(p => this.composer.addPass(p))
    passes[passes.length-1].renderToScreen = true;
  };

  onResize = ({ width, height, scale: pixelRatio }) => {
    this.props.camera.aspect = width / height;
    this.props.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  render() {
     if (this.composer && this.gl) {
      this.composer.render();
      this.gl.endFrameEXP();
    }
    return (
      <ExpoGraphics.View
        onContextCreate={this.onContextCreate}
        onResize={this.onResize}
        onShouldReloadContext={this.onShouldReloadContext}
        shouldIgnoreSafeGaurds
        isShadowsEnabled
      />
    );
  }
}

const renderHUD = (state, screen) => {
  if (!state.stickController) return null;

  const stickController = state.stickController;

  if (typeof stickController.renderer === "object")
    return (
      <stickController.renderer.type
        key={"stickController"}
        {...stickController}
        screen={screen}
      />
    );
  else if (typeof stickController.renderer === "function")
    return (
      <stickController.renderer
        key={"stickController"}
        {...stickController}
        screen={screen}
      />
    );
};

const ThreeJSRenderer = (...passes) => (state, screen) => {
  return (
    [<ThreeView
      passes={_.flatten(passes)}
      key={"threeView"}
      scene={state.scene}
      camera={state.camera}
    />, renderHUD(state, screen)]
  );
};

export default ThreeJSRenderer;