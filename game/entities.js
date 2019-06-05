import { Vector3, FreeCamera, MeshBuilder } from "babylonjs";
import { Sprite } from "./components"

export default async scene => {

	const camera = new FreeCamera("Camera", new Vector3(5, 5, 5), scene);
	
	camera.setTarget(Vector3.Zero());

	const box = MeshBuilder.CreateBox("", {}, scene);

	const entities = {
		scene,
		camera,
		sprite: await Sprite({ scene }),
		box: {
			model: box,
			rotation: {
				yaw: 0.01,
				roll: 0.01
			}
		}
	};

	return entities;
};