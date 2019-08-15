import { THREE } from 'expo-three';
import Box from "./components/box";
import Camera from "./components/camera";
import Cuphead from "./components/cuphead";
import HUD from "./components/hud";
import Turntable from "./components/turntable";
import Droid from "./components/droid";
import { clean } from "./utils/three";

const scene = new THREE.Scene();
const camera = Camera();

export default async () => {
	clean(scene);

	const ambient = new THREE.AmbientLight(0xffffff, 1);
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.95);

    sunlight.position.set(50, 50, 50);

    scene.add(ambient);
    scene.add(sunlight);

	camera.position.set(0, 2, 6);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const box = Box({ y: 1 });
	const cuphead = await Cuphead({ y: 1 });
	const droid = await Droid({ y: 1 });
	
	const turntable = Turntable({ parent: scene, items: [droid, box, cuphead ] });	
	const hud = HUD();

	const entities = {
		scene,
		camera,
		box,
		cuphead,
		droid,
		turntable,
		hud
	}

	return entities;
};