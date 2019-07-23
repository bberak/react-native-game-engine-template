import GPUParticleSystem from "../graphics/gpu-particle-system";

export default async ({
	maxParticles = 250,
	noiseTexture,
	particleTexture,
	scene,
	options = {},
	spawnOptions = {},
	beforeSpawn = () => {}
}) => {
	const emitter = new GPUParticleSystem({
		maxParticles,
		particleNoiseTex: await Promise.resolve(noiseTexture),
		particleSpriteTex: await Promise.resolve(particleTexture)
	});

	if (scene) scene.add(emitter);

	return {
		emitter,
		options,
		spawnOptions,
		beforeSpawn,
		tick: 0
	};
};
