import { Vector3, FreeCamera, MeshBuilder } from "babylonjs";
import { Sprite } from "./components"

export default async scene => {

	const camera = new FreeCamera("Camera", new Vector3(10, 10, 10), scene);
	
	camera.setTarget(Vector3.Zero());

	const entities = {
		scene,
		camera,
		sprite: await Sprite({ scene }),
		box: {
			model: MeshBuilder.CreateBox("", {}, scene),
			rotation: {
				y: 0.01,
				z: 0.01
			}
		}
	};

	return entities;
};
