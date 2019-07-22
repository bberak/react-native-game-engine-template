import { PerspectiveCamera } from "three";
import { screen, remap } from "../utils";
import { noise } from "../utils/perlin";

export default (Camera = () => {
	const camera = new PerspectiveCamera(
		120,
		screen.width / screen.height,
		1,
		1000
	);

	const lookAt = camera.lookAt;

	//-- Overriding the lookAt function so I always
	//-- have a quick reference to the lookAt vector
	camera.lookAt = vec => {
		lookAt.apply(camera, [vec]);
		camera.target = vec;
	};

	camera.timelines = {};

	camera.shake = (duration = 400) => {
		if (!camera.timelines.shake) {
			camera.timelines.shake = {
				duration,
				startPos: camera.position.clone(),
				seed: Date.now(),
				update(self, entities, percent, { seed, startPos }) {
					self.position.x =
						startPos.x + remap(noise(seed + percent), 0, 1, -5, 5);
					self.position.z =
						startPos.z +
						remap(noise(seed + 250 + percent), 0, 1, -5, 5);
				}
			};
		}
	};

	return camera;
});
