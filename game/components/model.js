import { THREE } from "expo-three";
import { add } from "../utils/three";

export default async ({ parent, x = 0, z = 0, y = 0, scale = 1, mesh, poses: mappings = {} }) => {

	const model = (await Promise.resolve(mesh)).clone();
	
	model.position.x = x;
	model.position.y = y;
	model.position.z = z;
	model.scale.x = scale;
	model.scale.y = scale;
	model.scale.z = scale;

	add(parent, model);

	const poses = {};
	const timelines = {};

	return {
		model,
		poses,
		timelines
	};
};