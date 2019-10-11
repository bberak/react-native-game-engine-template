import * as THREE from "three";
import { all } from "../utils";

const g = new THREE.Vector3(0, -0.08, 0);

const Gravity = entities => {
	const gravityEntities = all(entities, e => e.gravity && e.physics);

	gravityEntities.forEach(e => {
		e.physics.forces.add(e.gravity.isVector3 ? e.gravity : g);
	});

	return entities;
};

export default Gravity;
