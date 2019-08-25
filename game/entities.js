import { THREE } from 'expo-three';
import Camera from "./components/camera";
import Cuphead from "./components/cuphead";
import HUD from "./components/hud";
import Turntable from "./components/turntable";
import Droid from "./components/droid";
import Portal from "./components/portal";
import Jet from "./components/jet";
import { clear } from "./utils/three";
import * as OIMO from "oimo";

const scene = new THREE.Scene();
const camera = Camera();
const world = new OIMO.World({ 
    timestep: 1 / 60, 
    iterations: 8, 
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [0, -9.8 ,0] 
});

export default async () => {
	clear(scene);
	world.clear();

	const ambient = new THREE.AmbientLight(0xffffff, 1);
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.95);

    sunlight.position.set(50, 50, 50);

    scene.add(ambient);
    scene.add(sunlight);

	camera.position.set(0, 2, 6);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const cuphead = await Cuphead({ y: 1 });
	const droid = await Droid({ y: 1 });
	const portal = await Portal({ y: 1 });
	const jet = await Jet({ y: 1 });
	
	const turntable = Turntable({ parent: scene, world, items: [droid, cuphead, portal, jet] });	
	const hud = HUD();

	const entities = {
		scene,
		camera,
		world,
		droid,
		cuphead,
		portal,
		jet,
		turntable,
		hud
	}

	return entities;
};