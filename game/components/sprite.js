import { THREE } from "expo-three";
import { cloneTexture, add } from "../utils/three";
import { remap, clamp } from "../utils";

export default async ({ parent, x = 0, z = 0, y = 0, spriteSheet, rows, columns, actions: mappings = {} }) => {

	const texture = cloneTexture(await Promise.resolve(spriteSheet));

	texture.needsUpdate = true;
	texture.repeat.set(1 / columns, 1 / rows);

	const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
	const sprite = new THREE.Sprite(spriteMaterial);
	
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.position.z = z;

	add(parent, sprite);

	const actions = {};
	const timelines = {};

	Object.keys(mappings).forEach(key => {
		actions[key] = () => {

			if (timelines.action && timelines.action.key === key)
				return;

			let { start, end, loop = true, speed = 0.25, update, scaleX = 1, scaleY = 1, flipX = false, flipY = false } = mappings[key];
			end = end || start;

			sprite.scale.x = scaleX;
			sprite.scale.y = scaleY;

			texture.repeat.x = Math.abs(texture.repeat.x) * (flipX ? -1 : 1);
			texture.repeat.y = Math.abs(texture.repeat.y) * (flipY ? -1 : 1);

			let startColumn = start.column;
			let startRow = start.row;
			let endColumn = end.column;
			let endRow = end.row;

			if (flipX) {
				startColumn++;
				endColumn++;
			}

			if (flipY) {
				startRow++;
				endRow++;
			}

			const increment = speed * 1 / Math.max(Math.abs(endColumn - startColumn), Math.abs(endRow - startRow), 1)

			if (loop) {
				endColumn++;
				endRow++;
			}

			timelines.action = {
				while: true,
				counter: 0,
				key,
				update(entity, entities, timeline, args) {
					const percentage = loop ? timeline.counter % 1 : clamp(timeline.counter, 0, 1)
					const column = Math.trunc(remap(percentage, 0, 1, startColumn, endColumn))
					const row = Math.trunc(remap(percentage, 0, 1, startRow, endRow))

					texture.offset.x = column / columns;
					texture.offset.y = row / rows;
					timeline.counter += increment;

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