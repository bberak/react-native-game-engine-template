import ExpoTHREE from "expo-three";
import * as THREE from "three";
import Sprite from "./sprite";

const spriteSheet = ExpoTHREE.loadAsync(require("../../assets/spritesheets/cuphead.png"));

export default async (args) => {

	return Sprite({ ...args, spriteSheet, columns: 16, rows: 8 })
};