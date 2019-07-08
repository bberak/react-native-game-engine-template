import React, { PureComponent } from "react";
import { Platform } from "react-native";
import ExpoTHREE, { THREE } from 'expo-three';
import ExpoGraphics from 'expo-graphics'
import _ from "lodash";

THREE.suppressExpoWarnings();

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
  };

  onResize = ({ width, height, scale: pixelRatio }) => {
    this.props.camera.aspect = width / height;
    this.props.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  render() {
    if (this.renderer && this.gl) {
      this.renderer.render(this.props.scene, this.props.camera);
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

const ThreeJSRenderer = (...passes) => (state, screen) => {
  return (
    <ThreeView
      passes={_.flatten(passes)}
      key={"threeView"}
      scene={state.scene}
      camera={state.camera}
    />
  );
};

export default ThreeJSRenderer;