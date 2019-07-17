import * as THREE from "three";
import Sheet from "../../assets/spritesheets/cuphead.png";

//-- const s = Sprite({ sheet, actions: { run: { start: 0, end: 10, invertU: true, invertV: true, repeat: true  } } });

//-- s.sprite.run();

export default async ({ scene, x = 0, z = 0, y = 0, spriteSheet, rows, columns, actionMappings: actions = {} }) => {

	const map = await Promise.resolve(spriteSheet);
	map.needsUpdate = true;
	map.repeat.set(1 / columns, 1 / rows);

	const spriteMaterial = new THREE.SpriteMaterial({ map, color: 0xffffff });
	const sprite = new THREE.Sprite(spriteMaterial);
	
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.position.z = z;

	scene.add(sprite);

	const actions = {};
	const timelines = {};

	Object.keys(actionMappings).forEach(key => {
		actions[key] = () => {
			let { start, end } = actionMappings[key];
			end = end || start;

			timelines.action = {

			}
		}
	})

	return {
		model: sprite,
		actions,
		timelines
	};
};