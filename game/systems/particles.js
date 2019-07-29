import { all } from "../utils";

const Particles = (entities, args) => {
	const { time } = args;
	const entitiesWithParticles = all(entities, e => e.particles);

	for (let i = 0; i < entitiesWithParticles.length; i++) {
		const entity = entitiesWithParticles[i];
		const keys = Object.keys(entity.particles);

		for (let j = 0; j < keys.length; j++) {
			const ps = entity.particles[keys[j]];
			const { spawnOptions, options, beforeSpawn } = ps;
			const delta = (time.delta / 1000) * spawnOptions.timeScale;

			ps.tick += delta;

			if (ps.tick < 0) ps.tick = 0;

			if (delta > 0) {
				beforeSpawn(entity, entities, ps, args);

				for (let x = 0; x < spawnOptions.spawnRate * delta; x++) {
					ps.emitter.spawnParticle(options);
				}
			}

			ps.emitter.update(ps.tick);
		}
	}

	return entities;
};

export default Particles;
