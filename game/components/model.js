import { THREE } from "expo-three";
import { add } from "../utils/three";

export default async ({ parent, x = 0, z = 0, y = 0, mesh, poses: mappings = {} }) => {

	const model = (await Promise.resolve(mesh)).clone();
	
	model.position.x = x;
	model.position.y = y;
	model.position.z = z;

	add(parent, model);

	const poses = {};
	const timelines = {};

	return {
		model,
		poses,
		timelines
	};
};