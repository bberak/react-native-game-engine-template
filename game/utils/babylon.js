import { SpriteManager } from "babylonjs";

const getSpriteManager = (name, asset, capacity, size, scene) => {
	if (!scene.spriteMangers)
		scene.spriteMangers = {};

	if (!scene.spriteMangers[name])
		scene.spriteMangers[name] = new SpriteManager(name, asset, capacity, size, scene); 

	return scene.spriteMangers[name];
};

export {
	getSpriteManager
}