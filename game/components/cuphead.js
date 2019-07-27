import { Vector3, Euler } from "three";
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
			maxParticles: 250,
			options: {
				position: new Vector3(),
				positionRandomness: 0,
				velocity: new Vector3(),
				velocityRandomness: 0,
				color: 0xffffff,
				colorRandomness: 0,
				turbulence: 0.1,
				lifetime: 3,
				size: 25,
				sizeRandomness: 1,
				rotation: new Euler()
			},
			spawnOptions: {
				spawnRate: 0,
				timeScale: 1
			},
			beforeSpawn(self, entities, { options, spawnOptions, tick }, { stickController }) {
				options.rotation.set(0, 0, -stickController.heading);
				options.velocity.set(1, 0, 0);
				options.velocity.applyEuler(options.rotation);

				options.position.x = self.model.position.x;
				options.position.y = self.model.position.y;
				options.position.z = self.model.position.z;

				spawnOptions.spawnRate = stickController.a ? 40 : 0;
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
