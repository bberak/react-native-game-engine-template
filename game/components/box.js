import { THREE } from 'expo-three';
import { add } from "../utils/three";

export default ({
	parent,
	x = 0,
	y = 0,
	z = 0,
	width = 1.1,
	breadth = 1.1,
	height = 1.1,
	scale = 1,
	color = 0x00E6FF
}) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const material = new THREE.MeshStandardMaterial({ color });
	const box = new THREE.Mesh(geometry, material);

	box.translateX(x);
	box.translateY(y);
	box.translateZ(z);
	box.scale.x = scale;
	box.scale.y = scale;
	box.scale.z = scale;

	add(parent, box);

	return {
		model: box,
		removable: false,
		rotation: {
			x: 0.01,
			y: 0.01,
			z: 0.01
		}
	};
};
