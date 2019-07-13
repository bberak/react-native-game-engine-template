import * as THREE from "three";

export const clean = obj => {
	while (obj.children.length > 0) {
		clean(obj.children[0]);
		obj.remove(obj.children[0]);
	}

	if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
	if (obj.material && obj.material.dispose) obj.material.dispose();
	if (obj.texture && obj.texture.dispose) obj.texture.dispose();
};

export const remove = (scene, obj) => {
	clean(obj);
	scene.remove(obj);
};

export const direction = obj => {
	return obj.getWorldDirection(new THREE.Vector3());
};

export const rotateAroundPoint = (
	obj,
	point,
	{ thetaX = 0, thetaY = 0, thetaZ = 0 }
) => {
	//-- https://stackoverflow.com/a/42866733/138392
	//-- https://stackoverflow.com/a/44288885/138392

	const original = obj.position.clone();
	const pivot = point.clone();
	const diff = new THREE.Vector3().subVectors(original, pivot);

	obj.position.copy(pivot);

	obj.rotation.x += thetaX;
	obj.rotation.y += thetaY;
	obj.rotation.z += thetaZ;

	diff.applyAxisAngle(new THREE.Vector3(1, 0, 0), thetaX);
	diff.applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaY);
	diff.applyAxisAngle(new THREE.Vector3(0, 0, 1), thetaZ);

	obj.position.add(diff);
};

export const reparent = (subject, newParent) => {
	subject.matrix.copy(subject.matrixWorld);
	subject.applyMatrix(new THREE.Matrix4().getInverse(newParent.matrixWorld));
	newParent.add(subject);
};

export const getSize = model => {
	const currentSize = new THREE.Vector3();
	const currentBox = new THREE.Box3().setFromObject(model);

	currentBox.getSize(currentSize);

	return currentSize;
};