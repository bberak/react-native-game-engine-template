import { add, cloneMesh } from "../utils/three";
import { clamp } from "../utils";

export default async ({ parent, x = 0, z = 0, y = 0, scale = 1, mesh, morphTargets = {} }) => {

	const model = cloneMesh(await Promise.resolve(mesh));
	
	model.position.x = x;
	model.position.y = y;
	model.position.z = z;
	model.scale.x = scale;
	model.scale.y = scale;
	model.scale.z = scale;

	add(parent, model);

	const poses = {};
	
	Object.keys(morphTargets).forEach(key => {
		const index = morphTargets[key];

		poses[key] = weight => {
			if (weight === undefined || weight === null)
				return model.morphTargetInfluences[index];

			model.morphTargetInfluences[index] = clamp(weight, 0, 1);
		};
	})

	return {
		model,
		poses
	};
};