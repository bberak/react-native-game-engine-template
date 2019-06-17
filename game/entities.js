import { Vector3, FreeCamera, MeshBuilder, SceneLoader, Tools } from "babylonjs";
import "babylonjs-loaders";
import { Sprite } from "./components";
import { resolveAsync } from "expo-asset-utils";
import Model from "../assets/models/fighter.glb";

export default async scene => {

	const camera = new FreeCamera("Camera", new Vector3(10, 10, 10), scene);
	
	camera.setTarget(Vector3.Zero());

	const asset = await resolveAsync(Model);

	await SceneLoader.AppendAsync(asset.localUri, null, scene, scene => {
		console.log("SceneLoader.AppendAsync")
	});

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
