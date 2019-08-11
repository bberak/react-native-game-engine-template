import ExpoTHREE, { THREE } from "expo-three";
import Model from "./model";

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/jet.glb")
).then(gltf => gltf.scene);

export default async ({ parent, x = 0, y = 0, z = 0}) => {
	
	const model = await Model({
		parent,
		x,
		y,
		z,
		mesh
	});

	return model;
};
