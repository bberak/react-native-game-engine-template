import * as THREE from "three";
import Box from "./components/box";
import Camera from "./components/camera";
import Cuphead from "./components/cuphead";
import { clean } from "./utils/three";

const scene = new THREE.Scene();
const camera = Camera();

export default async () => {
	clean(scene);
	const ambient = new THREE.AmbientLight(0xffffff, 1)
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.95);

    sunlight.position.set(50, 50, 50);

    scene.add(ambient)
    scene.add(sunlight)

	camera.position.set(0, 0, 6);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const entities = {
		scene,
		camera,
		box: Box({ scene }),
		cuphead: await Cuphead({ scene, x: 5}),
		cuphead2: await Cuphead({ scene, x: -5}),
	};

	entities.cuphead.actions.joy();
	entities.cuphead2.actions.walk();

	return entities;
};