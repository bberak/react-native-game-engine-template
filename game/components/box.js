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
	color = 0x0000ff
}) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const material = new THREE.MeshStandardMaterial({ color });
	const cube = new THREE.Mesh(geometry, material);

	cube.translateX(x);
	cube.translateY(y);
	cube.translateZ(z);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.scale.x = scale;
	cube.scale.y = scale;
	cube.scale.z = scale;

	add(parent, cube);

	return {
		model: cube,
		removable: false,
		rotation: {
			x: 0.01,
			y: 0.01,
			z: 0.01
		}
	};
};
