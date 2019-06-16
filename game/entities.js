import { Vector3, FreeCamera, MeshBuilder, SceneLoader, Tools } from "babylonjs";
import "babylonjs-loaders";
import { Sprite } from "./components";
import { resolveAsync } from "expo-asset-utils";
import Model from "../assets/models/bomber.glb";

export default async scene => {

	const camera = new FreeCamera("Camera", new Vector3(10, 10, 10), scene);
	
	camera.setTarget(Vector3.Zero());

	// const asset = await resolveAsync(Model);

	// const _LoadFile = Tools.LoadFile;

	// Tools.LoadFile = (...args) => {
	// 	console.log("LoadFile", args)
	// 	return _LoadFile(...args);
	// }

	//-- Using asset.uri will call code above.. Tools.LoadFile
	//-- Using asset.localUri will throw an error in something called OfflineProviderFactory
	//-- I probably need to polyfill both..
	//-- https://github.com/BabylonJS/Babylon.js/search?q=OfflineProviderFactory&unscoped_q=OfflineProviderFactory
	//-- https://github.com/BabylonJS/Babylon.js/blob/9b53f27e5063a568b3755f5365b895512745ad8c/src/Offline/database.ts

	// SceneLoader.Append(asset.localUri, null, scene, function (scene) {
	// 	console.log("Get here")
	// });

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
