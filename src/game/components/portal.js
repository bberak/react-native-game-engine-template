import ExpoTHREE, { THREE } from "expo-three";
import Particles from "./particles";
import ParticleFile from "../../assets/textures/particle.png";

const particleTexture = ExpoTHREE.loadAsync(ParticleFile);

export default async ({
	parent,
	x = 0,
	y = 0,
	z = 0,
	height = 0.5,
	radius = 0.5,
	verticalSpeed = 0.01,
	horizontalSpeed = 0.3,
	color = 0xffffff
}) => {

	const swirl = await Particles({
		parent,
		particleTexture,
		maxParticles: 250,
		options: {
			position: new THREE.Vector3(x, y, z),
			positionRandomness: 0,
			velocity: new THREE.Vector3(),
			velocityRandomness: 0,
			color,
			colorRandomness: 0,
			turbulence: 0,
			lifetime: 12,
			size: 10,
			sizeRandomness: 0,
			verticalSpeed,
			theta: 0
		},
		spawnOptions: {
			spawnRate: 20,
			timeScale: 1
		},
		beforeSpawn(self, entities, { options }) {
			options.theta += horizontalSpeed;
			options.position.x = x + Math.cos(options.theta) * radius;
			options.position.y += options.verticalSpeed;
			options.position.z = z + Math.sin(options.theta) * radius;

			if (Math.abs(options.position.y - y) > height)
				options.verticalSpeed *= -1;
		}
	});

	return {
		model: swirl.emitter,
		particles: {
			swirl
		}
	};
};
