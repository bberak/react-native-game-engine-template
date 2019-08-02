import * as THREE from "three";

export default Turntable = ({ parent, x = 0, y = 0, z = 0, width = 1.1, radius = 4, height = 0.2, color = 0xdddddd, segments = 32, opacity = 1 }) => {

	const geometry = new THREE.CylinderGeometry(radius, radius + radius * 0.1, height, segments);
	const material = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, flatShading: true });
	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.position.x = x;
	cylinder.position.y = y;
	cylinder.position.z = z;
	
	if (parent && parent.model)
		parent.model.add(cylinder);
	else if (parent)
		parent.add(cylinder);

	return {
		model: cylinder,
		rotation: {
			y(self, entities, { swipeController }) {
				return cylinder.rotation.y + swipeController.oneFingerX * 0.01
			}
		}
	};
};