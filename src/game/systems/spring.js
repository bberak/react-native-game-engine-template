import * as THREE from "three";
import { all } from "../utils";

const Spring = entities => {
  const spingEntities = all(entities, e => e.spring && e.physics);

  spingEntities.forEach(e => {
    const {
      spring: { k, length, anchor, subtract },
      physics: { position, forces }
    } = e;

    const spring = subtract
      ? subtract(position, anchor, e.spring)
      : new THREE.Vector3().subVectors(position, anchor);
    const d = spring.length();
    const stretch = d - length;

    spring.normalize();
    spring.multiplyScalar(-1 * k * stretch);

    forces.add(spring);
  });

  return entities;
};

export default Spring;
