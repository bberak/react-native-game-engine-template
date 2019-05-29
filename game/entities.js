import { Vector3, FreeCamera, MeshBuilder } from "babylonjs";

export default async scene => {

	const camera = new FreeCamera("Camera", new Vector3(5, 5, 5), scene);
	
	camera.setTarget(Vector3.Zero());

	const box = MeshBuilder.CreateBox("", {}, scene);

	const entities = {
		scene,
		camera,
		box
	};

	return entities;
};
