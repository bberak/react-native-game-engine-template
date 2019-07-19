import React from "react";
import { StyleSheet, View } from "react-native";
import { screen } from "./index";

class StickControllerRender extends React.PureComponent {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 150,
    height: 150,
    backgroundColor: "red"
  }
});

let previous = {};

const StickController = (Wrapped = x => x) => (entities, args) => {
  if (!args.stickController) {

    const current = {
      x: -1,
      y: 1,
      a: true,
      b: false
    };

    args.stickController = Object.assign({}, current, { previous });

    previous = current;
  }

  if (!entities.stickController) {
    entities.stickController = { renderer: StickControllerRender }
  }

  return Wrapped(entities, args);
};

export default StickController;
