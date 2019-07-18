import ExpoTHREE from "expo-three";
import Sprite from "./sprite";

const spriteSheet = ExpoTHREE.loadAsync(
	require("../../assets/spritesheets/cuphead.png")
);

export default async args => {
	const s = await Sprite({
		...args,
		spriteSheet,
		columns: 16,
		rows: 8,
		actions: {
			joy: { start: { column: 0, row: 0 }, end: { column: 9, row: 0 }, speed: 0.3 },
			walk: { start: { column: 0, row: 1 }, end: { column: 12, row: 1 }, speed: 0.3 }
		}
	});

	return s;
};
