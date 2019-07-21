import React from "react";
import { StyleSheet, View } from "react-native";

class HUDRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const s1 = this.props.stickController || {};
    const s2 = nextProps.stickController || {};

    return Boolean(s1.x || s1.y) !== Boolean(s2.x || s2.y) || s1.a !== s2.a || s1.b !== s2.b;
  }

  render() {
    const {
      stickRadius = 0,
      stickPosition = { x: 0, y: 0 },
      aRadius = 0,
      aPosition = { x: 0, y: 0 },
      bRadius = 0,
      bPosition = { x: 0, y: 0 },
      a = false,
      b = false,
      x = 0,
      y = 0
    } = this.props.stickController || {};

    const usingStick = x || y;

    return [
      <View
        key={"stick"}
        style={[
          styles.container,
          {
            width: stickRadius * 2,
            height: stickRadius * 2,
            borderRadius: stickRadius * 2,
            left: stickPosition.x - stickRadius,
            top: stickPosition.y - stickRadius,
            backgroundColor: usingStick ? "white" : "transparent"
          }
        ]}
      />,
      <View
        key={"guide"}
        style={[
          styles.container,
          {
            width: stickRadius * 4,
            height: stickRadius * 4,
            borderRadius: stickRadius * 4,
            borderWidth: usingStick ? 5 : 0,
            left: stickPosition.x - stickRadius * 2,
            top: stickPosition.y - stickRadius * 2,
          }
        ]}
      />,
      <View
        key={"a"}
        style={[
          styles.container,
          {
            width: aRadius * 2,
            height: aRadius * 2,
            borderRadius: aRadius * 2,
            left: aPosition.x - aRadius,
            top: aPosition.y - aRadius,
            backgroundColor: a ? "white" : "transparent"
          }
        ]}
      />,
      <View
        key={"b"}
        style={[
          styles.container,
          {
            width: bRadius * 2,
            height: bRadius * 2,
            borderRadius: bRadius * 2,
            left: bPosition.x - bRadius,
            top: bPosition.y - bRadius,
            backgroundColor: b ? "white" : "transparent"
          }
        ]}
      />
    ];
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    opacity: 0.25
  }
});

export default () => {
  return { renderer: <HUDRenderer /> };
};
