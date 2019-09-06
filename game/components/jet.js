import ExpoTHREE, { THREE } from "expo-three";
import AnimatedModel from "./animated-model";
import { firstMesh } from "../utils/three";
import { between } from "../utils";
import JetFile from "../../assets/models/jet.glb";

const mesh = ExpoTHREE.loadAsync(JetFile).then(gltf => firstMesh(gltf.scene));

export default async ({ parent, x = 0, y = 0, z = 0}) => {

	const animated = await AnimatedModel({
		parent,
		x,
		y,
		z,
		mesh,
		morphTargets: {
			rudderLeft: 0,
			rudderRight: 1,
			leftFlapUp: 2,
			leftFlapDown: 3,
			rightFlapUp: 4,
			rightFlapDown: 5
		}
	});

	const timelines = {};

	timelines.controls = {
		while: true,
		directions: [
			{ heading: 0, pose: "rudderRight" },
			{ heading: -60, pose: "leftFlapDown" },
			{ heading: -120, pose: "leftFlapUp" },
			{ heading: -180, pose: "rudderLeft" },
			{ heading: 60, pose: "rightFlapUp" },
			{ heading: 120, pose: "rightFlapDown" },
			{ heading: 180, pose: "rudderLeft" }
		],
		update(self, entities, { directions }, { gamepadController }) {
			let target = null;

			if (gamepadController.heading !== null ) {
				const degrees = THREE.Math.radToDeg(gamepadController.heading)
				const direction = directions.find(x => between(degrees, x.heading - 30, x.heading + 30))

				if (direction)
					target = direction.pose;
			}

			directions.forEach(x => {
				const pose = self.poses[x.pose];
				const val = pose();

				pose(val + (x.pose === target ? 0.01 : -0.01))
			});
		}
	};

	return { ...animated, ...{ timelines }};
};
