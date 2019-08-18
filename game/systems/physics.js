import { all } from "../utils";

const Physics = entities => {
  const world = entities.world;
  const entitiesWithBodies = all(entities, e => e.bodies && e.model);

  if (world) world.step();

  entitiesWithBodies.forEach(e => {
    e.model.position.copy(e.bodies[0].getPosition());
    e.model.quaternion.copy(e.bodies[0].getQuaternion());
  });

  return entities;
};

export default Physics;
