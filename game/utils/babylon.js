import { SpriteManager } from "babylonjs";
import { Asset  } from "expo-asset";

const getSpriteManager = (name, module, capacity, size, scene) => {

	const asset = Asset.fromModule(module);

	if (!scene.spriteMangers)
		scene.spriteMangers = {};

	if (!scene.spriteMangers[name])
		scene.spriteMangers[name] = new SpriteManager(name, asset.uri, capacity, size, scene); 

	return scene.spriteMangers[name];
};

export {
	getSpriteManager
}