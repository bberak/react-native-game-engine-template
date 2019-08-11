import ExpoTHREE, { THREE } from "expo-three";
import Mixer from "./mixer";
import { firstMesh } from "../utils/three";
import { between } from "../utils";

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/jet.glb")
).then(gltf => firstMesh(gltf.scene));

export default async ({ parent, x = 0, y = 0, z = 0}) => {

	const mixer = await Mixer({
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
			{ heading: 0, track: "rudderRight" },
			{ heading: -60, track: "leftFlapDown" },
			{ heading: -120, track: "leftFlapUp" },
			{ heading: -180, track: "rudderLeft" },
			{ heading: 60, track: "rightFlapUp" },
			{ heading: 120, track: "rightFlapDown" },
			{ heading: 180, track: "rudderLeft" }
		],
		update(self, entities, { directions }, { stickController }) {
			let target = null;

			if (stickController.heading !== null ) {
				const degrees = THREE.Math.radToDeg(stickController.heading)
				const direction = directions.find(x => between(degrees, x.heading - 30, x.heading + 30))

				if (direction)
					target = direction.track;
			}

			directions.forEach(x => {
				const track = self.tracks[x.track];
				const val = track();

				track(val + (x.track === target ? 0.01 : -0.01))
			});
		}
	};

	return { ...mixer, ...{ timelines }};
};
