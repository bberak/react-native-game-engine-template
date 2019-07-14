import * as THREE from "three";
import Box from "./components/box";
import { clean } from "./utils/three";
import { screen } from "./utils";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, screen.width / screen.height, 1, 1000);

export default async () => {
	clean(scene);
	const ambient = new THREE.AmbientLight(0xffffff, 0.3)
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);

    sunlight.position.set(0, 50, 0);

    scene.add(ambient)
    scene.add(sunlight)

	camera.position.set(0, 0, 5);
	camera.target = new THREE.Vector3(0, 0, 0);

	const entities = {
		scene,
		camera,
		box: Box({ scene })
	};

	return entities;
};