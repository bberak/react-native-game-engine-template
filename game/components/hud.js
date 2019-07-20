import React from "react";
import { StyleSheet, View } from "react-native";

class HUDRenderer extends React.PureComponent {
  render() {
    const {
      stickRadius = 20,
      stickPosition = { x: 0, y: 0 },
      aRadius = 20,
      aPosition = { x: 0, y: 0 },
      bRadius = 20,
      bPosition = { x: 0, y: 0 }
    } = this.props.stickController || {};
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
            top: stickPosition.y - stickRadius
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
            top: aPosition.y - aRadius
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
            top: bPosition.y - bRadius
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
    borderColor: "white"
  }
});

export default () => {
  return { renderer: <HUDRenderer /> };
};
