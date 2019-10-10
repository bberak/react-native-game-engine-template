import { all } from "../utils";

const Physics = (entities, args) => {
  const world = entities.world;
  const entitiesWithBodies = all(entities, e => e.bodies && e.model);

  if (world) 
  	world.step();

  for (let x = 0; x < entitiesWithBodies.length; x++) {
  	const entity = entitiesWithBodies[x];
  	const model = entity.model;
  	const body = entity.bodies[0];
  	const collision = entity.collision;

	if (!body.sleeping) {
  		model.position.copy(body.getPosition());
    	model.quaternion.copy(body.getQuaternion());
  	}

  	if (collision) {
  		for (let y = 0; y < entitiesWithBodies.length; y++) {
  			if (x === y) 
  				continue;

  			const otherEntity = entitiesWithBodies[y];
  			const otherBody = otherEntity.bodies[0];
  			const contact = world.getContact(body, otherBody);

  			if (contact)
  				collision(entity, otherEntity, contact, entities, args);
  		}
  	}
  }

  return entities;
};

export default Physics;
