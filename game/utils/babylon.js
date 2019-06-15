import { SpriteManager } from "babylonjs";
import { Asset  } from "expo-asset";
import { resolveAsync } from "expo-asset-utils";

const assetCache = {};

const getAsset = uri => {
	
	if (!assetCache[uri]) {
		console.log("CACHE MISS");
		assetCache[uri] = resolveAsync(uri);
	} else
		console.log("CACHE HIT");

	return assetCache[uri];
}

const getSpriteManager = async (name, module, capacity, size, scene) => {

	const { uri } = Asset.fromModule(module);

	const asset = await getAsset(uri);

	if (!scene.spriteMangers)
		scene.spriteMangers = {};

	if (!scene.spriteMangers[name])
		scene.spriteMangers[name] = new SpriteManager(name, uri, capacity, size, scene); 

	return scene.spriteMangers[name];
};

export {
	getSpriteManager,
	getAsset
}