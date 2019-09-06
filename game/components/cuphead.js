import ExpoTHREE, { THREE } from "expo-three";
import Sprite from "./sprite";
import { between } from "../utils";
import CupheadFile from "../../assets/sprite-sheets/cuphead.png";

const spriteSheet = ExpoTHREE.loadAsync(CupheadFile);

export default async ({ parent, x = 0, y = 0, z = 0}) => {
	
	const sprite = await Sprite({
		parent,
		x,
		y,
		z,
		spriteSheet,
		columns: 16,
		rows: 8,
		actions: {
			idle: {
				start: { row: 2, column: 0 }
			},
			jump: {
				start: { row: 0,  column: 0 },
				end: { row: 0, column: 9 },
				loop: false
			},
			s: {
				start: { row: 1, column: 0 },
				end: { row: 1, column: 12 }
			},
			se: {
				start: { row: 3, column: 0 },
				end: { row: 3, column: 15 }
			},
			e: {
				start: { row: 4, column: 0 },
				end: { row: 4, column: 13 }
			},
			ne: {
				start: { row: 6, column: 0 },
				end: { row: 6, column: 14 }
			},
			n: {
				start: { row: 7, column: 1 },
				end: { row: 7, column: 15 }
			},
			nw: {
				start: { row: 6, column: 0 },
				end: { row: 6, column: 14 },
				flipX: true
			},
			w: {
				start: { row: 4, column: 0 },
				end: { row: 4, column: 13 },
				flipX: true
			},
			sw: {
				start: { row: 3, column: 0 },
				end: { row: 3, column: 15 },
				flipX: true
			}
		}
	});

	sprite.timelines.controls = {
		while: true,
		directions: [
			{ heading: 0, action: "e" },
			{ heading: -45, action: "ne" },
			{ heading: -90, action: "n" },
			{ heading: -135, action: "nw" },
			{ heading: -180, action: "w" },
			{ heading: 45, action: "se" },
			{ heading: 90, action: "s" },
			{ heading: 135, action: "sw" },
			{ heading: 180, action: "w" }
		],
		update(self, entities, { directions }, { gamepadController }) {
			if (gamepadController.heading !== null ) {
				const degrees = THREE.Math.radToDeg(gamepadController.heading)
				const direction = directions.find(x => between(degrees, x.heading - 25, x.heading + 25))

				self.actions[direction.action]()
			} else self.actions.idle();
		}
	};

	return sprite;
};
