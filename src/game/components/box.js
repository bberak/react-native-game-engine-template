import { THREE } from "expo-three";
import { add } from "../utils/three";
import { sound } from "../utils";
import CrashFile from "../../assets/audio/crash-01.wav";

export default ({
	parent,
	world,
	dynamic = true,
	x = 0,
	y = 0,
	z = 0,
	width = 1.1,
	breadth = 1.1,
	height = 1.1,
	scale = 1,
	color = 0x00e6ff
}) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const material = new THREE.MeshStandardMaterial({ color });
	const box = new THREE.Mesh(geometry, material);

	box.position.x = x;
	box.position.y = y;
	box.position.z = z;
	box.scale.x = scale;
	box.scale.y = scale;
	box.scale.z = scale;

	add(parent, box);

	const crash = sound(CrashFile, 16 * 40);

	return {
		model: box,
		bodies: [
			world.add({
				type: "box",
				size: [width * scale, height * scale, breadth * scale],
				pos: [x, y, z],
				rot: [0, 0, 0],
				move: dynamic,
				density: 0.1,
				friction: 0.9,
				restitution: 0.2,
				belongsTo: 1,
				collidesWith: 0xffffffff
			})
		],
		collision: (self, other, contact, entities, { gamepadController }) => {
			if (!contact.close) {
				crash();

				const camera = entities.camera;

				if (camera)
					camera.shake();

				if (gamepadController)
					gamepadController.vibrate();
			}
		},
		removable: (frustum, self) => !frustum.intersectsObject(self.model)
	};
};
