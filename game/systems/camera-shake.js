import { noise } from "../utils/perlin";
import { remap } from "../utils";

const CameraShake = (entities, { events, time }) => {
	const collision = events.find(x => x.type === "collision");

	if (collision && collision.entities.find(x => x.player)) {
		const camera = entities.camera;

		if (!camera.timelines.shake) {
			camera.timelines.shake = {
				duration: 400,
				args: {
					start: camera.position.clone(),
					seed: time.current
				},
				update(self, entities, percent, { seed, start }) {
					self.position.x =
						start.x + remap(noise(seed + percent), 0, 1, -5, 5);
					self.position.z =
						start.z +
						remap(noise(seed + 250 + percent), 0, 1, -4, 4);
				}
			};
		}
	}

	return entities;
};

export default CameraShake;
