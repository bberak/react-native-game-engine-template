import { THREE } from "expo-three";
import SkeletonUtils from "./skeleton-utils";

export const clean = obj => {
	while (obj.children.length > 0) {
		clean(obj.children[0]);
		obj.remove(obj.children[0]);
	}

	if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
	if (obj.material && obj.material.dispose) obj.material.dispose();
	if (obj.texture && obj.texture.dispose) obj.texture.dispose();
};

export const clear = clean;

export const remove = (parent, child) => {
	if (child)
		clean(child);

	if (parent)
		parent.remove(child);
};

export const direction = obj => {
	return obj.getWorldDirection(new THREE.Vector3());
};

export const rotateAroundPoint = (
	obj,
	point,
	{ x = 0, y = 0, z = 0 }
) => {
	//-- https://stackoverflow.com/a/42866733/138392
	//-- https://stackoverflow.com/a/44288885/138392

	const original = obj.position.clone();
	const pivot = point.clone();
	const diff = new THREE.Vector3().subVectors(original, pivot);

	obj.position.copy(pivot);

	obj.rotation.x += x;
	obj.rotation.y += y;
	obj.rotation.z += z;

	diff.applyAxisAngle(new THREE.Vector3(1, 0, 0), x);
	diff.applyAxisAngle(new THREE.Vector3(0, 1, 0), y);
	diff.applyAxisAngle(new THREE.Vector3(0, 0, 1), z);

	obj.position.add(diff);
};

export const model = obj => {
	return obj.model ? obj.model : obj;
};

export const add = (parent, child) => {
	if (!parent || !child)
		return;

	const p = parent.model ? parent.model : parent;
	const c = child.model ? child.model : child;

	model(p).add(model(c))
};

export const reparent = (subject, newParent) => {
	subject.matrix.copy(subject.matrixWorld);
	subject.applyMatrix(new THREE.Matrix4().getInverse(newParent.matrixWorld));
	newParent.add(subject);
};

export const size = model => {
	const currentSize = new THREE.Vector3();
	const currentBox = new THREE.Box3().setFromObject(model);

	currentBox.getSize(currentSize);

	return currentSize;
};

export const cloneTexture = texture => {
	const clone = texture.clone();

 	//-- Forces passing to `gl.texImage2D(...)` verbatim
  	clone.isDataTexture = true;

  	return clone;
};

export const cloneMesh = SkeletonUtils.clone;

export const firstMesh = obj => {
	if (!obj)
		return;

	if (obj.isMesh)
		return obj;

	if (obj.children && obj.children.length){
		for (let i = 0; i < obj.children.length; i++) {
			const test = firstMesh(obj.children[i]);

			if (test && test.isMesh)
				return test;
		}
	}
};