import { THREE } from 'expo-three';
import { add, rotateAroundPoint } from "../utils/three";

export default ({ parent, world, items = [], x = 0, y = 0, z = 0, radius = 4, height = 0.2, color = 0xdddddd, segments = 32, opacity = 1 }) => {

	const geometry = new THREE.CylinderGeometry(radius, radius + radius * 0.1, height, segments);
	const material = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, flatShading: true });
	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.position.x = x;
	cylinder.position.y = y;
	cylinder.position.z = z;

	items.forEach((item, idx) => {
		item.model.position.z = radius - 1;
		rotateAroundPoint(item.model, cylinder.position, { y: ((Math.PI * 2) / items.length) * idx })
		add(cylinder, item);

		if (item.bodies) 
			item.bodies[0].position.set(item.model.position.x, item.model.position.y, item.model.position.z)
	})
	
	add(parent, cylinder);

	const primary = world.add({ 
	    type: "cylinder",
	    size: [radius, height],
	    pos: [x, y, z],
	    rot: [0, 0, 0],
	    move: true,
	    density: 0.9,
	    friction: 0.9,
	    restitution: 0.2,
	    belongsTo: 1,
	    collidesWith: 0xffffffff
	});

	const base = world.add({ type: "cylinder", size: [radius, height], pos: [x, y, z], move: false });

	const hinge = world.add({
		type: "jointHinge",
		body1: primary, 
		body2: base,
		axe1: [0, 1, 0],
		axe2: [0, 1, 0],
		pos1: [primary.position.x, primary.position.y, primary.position.z],
		pos2: [base.position.x, base.position.y, base.position.z]
	});

	return {
		model: cylinder,
		bodies: [primary, base, hinge],
		timelines: {
			swipe: {
				while: true,
				update(self, entities, timeline, { touchController, gamepadController }) {
					if (gamepadController.heading !== null || gamepadController.a || gamepadController.b)
						return;

					if (touchController.singleFingerMovement.x)
						self.bodies[0].angularVelocity.set(0, touchController.singleFingerMovement.x * 0.1, 0)
					else if (touchController.start)
						self.bodies[0].angularVelocity.set(0, 0, 0)
				}
			}
		}
	}
};