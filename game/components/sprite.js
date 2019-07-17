import * as THREE from "three";

export default async ({ scene, x = 0, z = 0, y = 0, spriteSheet, rows, columns, actions: mappings = {} }) => {
	
	const texture = await Promise.resolve(spriteSheet);
	texture.needsUpdate = true;
	texture.repeat.set(1 / columns, 1 / rows);

	const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
	const sprite = new THREE.Sprite(spriteMaterial);
	
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.position.z = z;

	scene.add(sprite);

	const actions = {};
	const timelines = {};

	Object.keys(mappings).forEach(key => {
		actions[key] = () => {
			let { start, end, repeat = true, speed = 1 } = mappings[key];
			end = end || start;

			timelines.action = {
				while: true,
				index: 0,
				update(entity, entities, timeline, args) {
					const frameColumn = repeat ? timeline.index % Math.max(end.column - start.column, 1) + start.column : Math.min(timeline.index + start.column, end.column);
					const frameRow = repeat ? timeline.index % Math.max(end.row - start.row, 1) + start.row : Math.min(timeline.index + start.row, end.row);
					
					texture.offset.x = Math.trunc(frameColumn) / columns;
					texture.offset.y = Math.trunc(frameRow) / rows;
					timeline.index += speed;
				}
			}
		}
	})

	return {
		model: sprite,
		actions,
		timelines
	};
};