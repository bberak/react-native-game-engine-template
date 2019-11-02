import { allKeys } from "../utils";
import { QuadTree, Box, Point, Circle } from "js-quadtree";
import _ from "lodash";

const createTree = (collideableKeys, entities, { x = -50, y = -50, width = 100, height = 100 } = {}) => {
  const tree = new QuadTree(
    new Box(x, y, width, height)
  );

  for (let i = 0; i < collideableKeys.length; i++) {
    const key = collideableKeys[i];
    const collideable = entities[key];

    tree.insert(
      new Point(
        collideable.physics.position.x,
        collideable.physics.position.z,
        { entityId: key }
      )
    );
  }

  return tree;
};

const queryTree = (tree, collideable) => {
  return tree.query(
    new Circle(
      collideable.physics.position.x,
      collideable.physics.position.z,
      collideable.collisions.sweepRadius
    )
  );
};

const hitTests = [
  ["isBox3", "isBox3", (b1, b2) => b1.intersectsBox(b2)],
  ["isBox3", "isSphere", (b1, b2) => b1.intersectsSphere(b2)],
  ["isBox3", "isPlane", (b1, b2) => b1.intersectsPlane(b2)],
  ["isSphere", "isBox3", (b1, b2) => b1.intersectsBox(b2)],
  ["isSphere", "isSphere", (b1, b2) => b1.intersectsSphere(b2)],
  ["isSphere", "isPlane", (b1, b2) => b1.intersectsPlane(b2)],
  ["isPlane", "isBox3", (b1, b2) => b1.intersectsBox(b2)],
  ["isPlane", "isSphere", (b1, b2) => b1.intersectsSphere(b2)]
];

const collided = (hitTest, bounds, otherBounds) => {
  //-- This could be extended to handle the case where bounds
  //-- and otherBounds are arrays (for complex models)
  return (
    bounds[hitTest[0]] &&
    otherBounds[hitTest[1]] &&
    hitTest[2](bounds, otherBounds)
  );
};

const notify = (defer, key, otherKey, collideable, other, force) => {
  defer({
    type: "collision",
    entities: [collideable, other],
    keys: [key, otherKey],
    force
  });
};

const Collisions = config => (entities, args) => {
  const collideableKeys = allKeys(entities, e => e.collisions && e.physics);

  if (collideableKeys.length) {
    //-- Populate tree

    const tree = createTree(collideableKeys, entities, config);

    //-- Query tree

    for (let i = 0; i < collideableKeys.length; i++) {
      const key = collideableKeys[i];
      const entity = entities[key];
      const entityCollisions = entity.collisions;

      //-- Continue if this entity is a hit target

      if (entityCollisions.predicate) {
        const results = queryTree(tree, entity);

        //-- Continue if another entity was found in the vicinity

        if (results.length > 1) {
          const bounds = _.isFunction(entityCollisions.bounds)
            ? entityCollisions.bounds()
            : entityCollisions.bounds;

          for (let j = 0; j < results.length; j++) {
            const otherKey = results[j].data.entityId;
            const other = entities[otherKey];
            const otherCollisions = other.collisions;

            if (key === otherKey) continue;

            //-- Does the current entity care about the one he has collied with?

            if (entityCollisions.predicate(entity, other)) {
              const otherBounds = _.isFunction(otherCollisions.bounds)
                ? otherCollisions.bounds()
                : otherCollisions.bounds;

              for (let k = 0; k < hitTests.length; k++) {
                const test = hitTests[k];

                //-- Check whether an actual collision occured using proper bounds

                if (collided(test, bounds, otherBounds)) {
                  const force = entity.physics.velocity
                    .clone()
                    .multiplyScalar(entity.physics.mass)
                    .add(
                      other.physics.velocity
                        .clone()
                        .multiplyScalar(other.physics.mass)
                    );

                  if (entityCollisions.hit)
                    entityCollisions.hit(entity, other, force, args);

                  if (entityCollisions.notify)
                    notify(args.defer, key, otherKey, entity, other, force, args);

                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  return entities;
};

export default Collisions;
