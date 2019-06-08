import { Vector3, Sprite } from "babylonjs";
import { loadBuffer } from "../utils";
import { getSpriteManager } from "../utils/babylon";
import Sheet from "../../assets/spritesheets/cuphead.png";
import { Asset } from 'expo';

export default async ({ scene, x = 0, z = 0, y = 0 }) => {

	const test = await Asset.fromModule(Sheet).downloadAsync();
	//const test = Asset.fromModule(Sheet);
	const test2 = Asset.fromModule(Sheet);

	console.log(test, test2);

	const buffer = await loadBuffer(test2.uri);

	console.log(buffer)

	const manager = getSpriteManager("player", buffer, 1, { width: 103.0625, height: 113.125 }, scene);
	const sprite = new Sprite("player", manager);
	
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.position.z = z;
	sprite.size = 5.5
	sprite.cellIndex = 48;
	sprite.playAnimation(50, 61, true, 100);
	sprite.invertU = -1;
	
	return {
		model: sprite,
		removable: false,
		damage: {
			amount: 9999
		},
		gravity: false,
		player: true,
		animations: {},
		physics: {
			mass: 2.5,
			maxSpeed: 0.5,
			forces: new Vector3(),
			acceleration: new Vector3(),
			velocity: new Vector3(),
			position: sprite.position,
			damping: 0.118
		}
	};
};