import ExpoTHREE from "expo-three";
import GPUParticleSystem from "../graphics/gpu-particle-system";

const _noiseTexture = ExpoTHREE.loadAsync(
	require("../../assets/textures/perlin.png")
);

export default async ({
	maxParticles = 250,
	noiseTexture,
	particleTexture,
	parent,
	options = {},
	spawnOptions = {},
	beforeSpawn = () => {}
}) => {
	const emitter = new GPUParticleSystem({
		maxParticles,
		particleNoiseTex: await Promise.resolve(noiseTexture || _noiseTexture),
		particleSpriteTex: await Promise.resolve(particleTexture)
	});

	if (parent && parent.model)
		parent.model.add(emitter);
	else if (parent)
		parent.add(emitter);

	return {
		emitter,
		options,
		spawnOptions,
		beforeSpawn,
		tick: 0
	};
};
