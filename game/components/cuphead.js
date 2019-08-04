import { Vector3, Euler, Group } from "three";
import ExpoTHREE from "expo-three";
import Sprite from "./sprite";
import Particles from "./particles";
import { add } from "../utils/three";

const spriteSheet = ExpoTHREE.loadAsync(
	require("../../assets/spritesheets/cuphead.png")
);

const particleTexture = ExpoTHREE.loadAsync(
	require("../../assets/textures/particle.png")
);

export default async ({ parent, x = 0, y = 0, z = 0}) => {
	
	const group = new Group();

	const shoot = await Particles({
		parent: group,
		particleTexture,
		maxParticles: 250,
		options: {
			position: new Vector3(),
			positionRandomness: 0,
			velocity: new Vector3(0, 1, 0),
			velocityRandomness: 0,
			color: 0xffffff,
			colorRandomness: 0,
			turbulence: 0.1,
			lifetime: 1,
			size: 25,
			sizeRandomness: 1,
			rotation: new Euler()
		},
		spawnOptions: {
			spawnRate: 0,
			timeScale: 1
		},
		beforeSpawn(self, entities, { options, spawnOptions }, { stickController }) {
			options.rotation.set(0, 0, -stickController.heading);
			options.velocity.set(1, 0, 0);
			options.velocity.applyEuler(options.rotation);

			options.position.x = 1;
			options.position.y = 1;
			options.position.z = 1;

			if (stickController.a) {
				spawnOptions.spawnRate =  40;
				options.color = 0xffffff;
			} else if (stickController.b) {
				spawnOptions.spawnRate =  40;
				options.color = 0xff0000;
			} else {
				spawnOptions.spawnRate = 0;
			}
		}
	});

	const sprite = await Sprite({
		parent: group,
		x,
		y,
		z,
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

	add(parent, group);

	return { ...sprite, ...{ particles: { shoot }}, ...{ model: group }};
};
