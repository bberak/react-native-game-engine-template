import { THREE } from 'expo-three';
import ExpoTHREE from "expo-three";
import Model from "./model";
import { add } from "../utils/three";

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/jet.glb")
).then(gltf => gltf.scene);

export default async ({ parent, x = 0, y = 0, z = 0}) => {
	
	const group = new THREE.Group();

	const model = await Model({
		parent: group,
		x,
		y,
		z,
		mesh
	});

	add(parent, group);

	return { ...model, ...{ model: group }};
};
