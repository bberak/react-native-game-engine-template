import * as THREE from "three";
import { cloneTexture } from "../utils/three";

export default async ({ parent, x = 0, z = 0, y = 0, spriteSheet, rows, columns, actions: mappings = {} }) => {

	const texture = cloneTexture(await Promise.resolve(spriteSheet));

	texture.needsUpdate = true;
	texture.repeat.set(1 / columns, 1 / rows);

	const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
	const sprite = new THREE.Sprite(spriteMaterial);
	
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.position.z = z;

	if (parent && parent.model)
		parent.model.add(sprite);
	else if (parent)
		parent.add(sprite);

	const actions = {};
	const timelines = {};

	Object.keys(mappings).forEach(key => {
		actions[key] = () => {
			let { start, end, repeat = true, speed = 1, update } = mappings[key];
			end = end || start;

			timelines.action = {
				while: true,
				index: 0,
				update(entity, entities, timeline, args) {
					const column = Math.trunc(repeat ? timeline.index % (end.column - start.column + 1) + start.column : Math.min(timeline.index + start.column, end.column));
					const row = Math.trunc(repeat ? timeline.index % (end.row - start.row + 1) + start.row : Math.min(timeline.index + start.row, end.row));
					
					texture.offset.x = column / columns;
					texture.offset.y = row / rows;
					timeline.index += speed;

					if (update)
						update(entity, entities, { column, row }, args)
				}
			}
		}
	});

	return {
		model: sprite,
		actions,
		timelines
	};
};