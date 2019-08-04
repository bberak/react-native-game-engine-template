import * as THREE from "three";
import Box from "./components/box";
import Camera from "./components/camera";
import Cuphead from "./components/cuphead";
import Portal from "./components/portal";
import HUD from "./components/hud";
import Turntable from "./components/turntable";
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
	const box2 = Box({ y: 1 });
	const portal = await Portal({ y: 1 });
	const portal2 = await Portal({ y: 1, color: 0x00ff00 });
	const portal3 = await Portal({ y: 1, color: 0x00ffff });
	const portal4 = await Portal({ y: 1, color: 0xff00ff });
	const cuphead = await Cuphead({ y: 1 });
	const cuphead2 = await Cuphead({ y: 1 });
	
	const turntable = Turntable({ parent: scene, items: [box, box2, portal, portal2, portal3, portal4, cuphead, cuphead2] });	
	const hud = HUD();

	const entities = {
		scene,
		camera,
		box,
		box2,
		portal,
		portal2,
		portal3,
		portal4,
		cuphead,
		cuphead2,
		turntable,
		hud
	}

	return entities;
};