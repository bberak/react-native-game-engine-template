import { Vector3 } from "three";
import ExpoTHREE from "expo-three";
import Sprite from "./sprite";
import Particles from "./particles";

const spriteSheet = ExpoTHREE.loadAsync(
	require("../../assets/spritesheets/cuphead.png")
);

const noiseTexture = ExpoTHREE.loadAsync(
	require("../../assets/textures/perlin.png")
);

const particleTexture = ExpoTHREE.loadAsync(
	require("../../assets/textures/particle.png")
);

export default async args => {
	const particles = {
		stuff: await Particles({
			...args,
			noiseTexture,
			particleTexture,
			options: {
				position: new Vector3(),
				positionRandomness: 0.3,
				velocity: new Vector3(0, 1, 0),
				velocityRandomness: 0.05,
				color: 0xffffff,
				colorRandomness: 0,
				turbulence: 0.1,
				lifetime: 20,
				size: 25,
				sizeRandomness: 1,
				offset: new Vector3()
			},
			spawnOptions: {
				spawnRate: 0,
				timeScale: 1
			},
			beforeSpawn(self, entities, { options, spawnOptions, tick }, { stickController }) {
				options.offset.applyEuler(self.model.rotation);

				options.position.x = self.model.position.x + options.offset.x;
				options.position.y = self.model.position.y + options.offset.y;
				options.position.z = self.model.position.z + options.offset.z;

				options.velocity.x = 0;
				options.velocity.y = 0.1;
				options.velocity.z = 0;

				spawnOptions.spawnRate = (stickController && stickController.a) ? 40 : 0;
			}
		})
	};

	const sprite = await Sprite({
		...args,
		spriteSheet,
		columns: 16,
		rows: 8,
		actions: {
			joy: {
				start: { column: 0, row: 0 },
				end: { column: 9, row: 0 },
				speed: 0.3
			},
			walk: {
				start: { column: 0, row: 1 },
				end: { column: 12, row: 1 },
				speed: 0.3
			}
		}
	});

	return Object.assign({ particles }, sprite);
};
