import * as THREE from "three";
import { add } from "../utils/three";

export default Turntable = ({ parent, x = 0, y = 0, z = 0, width = 1.1, radius = 4, height = 0.2, color = 0xdddddd, segments = 32, opacity = 1 }) => {

	const geometry = new THREE.CylinderGeometry(radius, radius + radius * 0.1, height, segments);
	const material = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, flatShading: true });
	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.position.x = x;
	cylinder.position.y = y;
	cylinder.position.z = z;
	
	add(parent, cylinder);

	return {
		model: cylinder,
		timelines: {
			swipe: {
				while: true,
				update(self, entities, timeline, { swipeController, stickController, touches }) {
					if (stickController.heading || stickController.a || stickController.b)
						return;

					if (swipeController.oneFingerX) {
						self.timelines.turn = {
							momentum: swipeController.oneFingerX,
							while: (_1, _2, turn) => Math.abs(turn.momentum) > 0.02,
							update: (_1, _2, turn) => {
								self.model.rotation.y += 0.01 * turn.momentum
								turn.momentum *= 0.95
							}
						}
					} else if (touches.find(x => x.type == "start"))
						delete self.timelines.turn;
				}
			}
		}
	}
};