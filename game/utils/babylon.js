import { SpriteManager } from "babylonjs";
import { Asset  } from "expo-asset";
import { resolveAsync } from "expo-asset-utils";
import _ from "lodash";

const getSpriteManager = async (name, ref, capacity, size, scene) => {

	const asset = await resolveAsync(ref);

	if (!scene.spriteMangers)
		scene.spriteMangers = {};

	if (!scene.spriteMangers[name])
		scene.spriteMangers[name] = new SpriteManager(name, asset.localUri, capacity, size, scene); 

	return scene.spriteMangers[name];
};

export {
	getSpriteManager
}