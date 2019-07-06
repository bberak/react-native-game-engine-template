import { THREE } from "expo-three";

export default Box = ({ scene, x = 0, y = 0, z = 0, width = 1.1, breadth = 1.1, height = 1.1, scale = 1, color = 0x22BCE6 }) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const edges = new THREE.EdgesGeometry(geometry);
	const material = new THREE.LineBasicMaterial({ color, linewidth: 4 });
	const cube = new THREE.LineSegments(edges, material);

	cube.translateX(x);
	cube.translateY(y);
	cube.translateZ(z);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.scale.x = scale;
	cube.scale.y = scale;
	cube.scale.z = scale;

	scene.add(cube);

	return {
		model: cube,
		removable: true,
		rotation: {
			y: 0.01,
			z: 0.01
		}
	};
};