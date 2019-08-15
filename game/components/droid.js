import ExpoTHREE, { THREE } from "expo-three";
import Mixer from "./mixer";
import { firstMesh } from "../utils/three";
import { between } from "../utils";

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/droid.fbx")
);

export default async ({ parent, x = 0, y = 0, z = 0}) => {

	const mixer = await Mixer({ parent, x, y, z, mesh, scale: 0.0035 })

	return mixer;
};
