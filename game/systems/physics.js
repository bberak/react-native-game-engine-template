import { all } from "../utils";

const Physics = entities => {
  const world = entities.world;
  const entitiesWithBodies = all(entities, e => e.body && e.model);

  if (world) world.step();

  entitiesWithBodies.forEach(e => {
    e.model.position.copy(e.body.getPosition());
    e.model.quaternion.copy(e.body.getQuaternion());
  });

  return entities;
};

export default Physics;
