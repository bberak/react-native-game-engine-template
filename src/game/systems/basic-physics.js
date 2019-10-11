import { all } from "../utils";

const Physics = entities => {
  const physicsEntities = all(entities, e => e.physics);

  physicsEntities.forEach(e => {
    const {
      mass,
      forces,
      acceleration,
      velocity,
      position,
      maxSpeed,
      damping
    } = e.physics;

    forces.divideScalar(mass);
    acceleration.add(forces);

    if (damping) velocity.multiplyScalar(1 - damping);

    velocity.add(acceleration);

    if (maxSpeed) velocity.clampLength(0, maxSpeed);

    position.add(velocity);

    forces.set(0, 0, 0);
    acceleration.set(0, 0, 0);
  });

  return entities;
};

export default Physics;
