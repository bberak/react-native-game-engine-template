import Box from "../components/box"
import Cylinder from "../components/cylinder"
import { all, id } from "../utils";

const boxId = (id => () => id("box"))(id(0));
const cylinderId = (id => () => id("cylinder"))(id(0));

const Spawn = (entities, { stickController }) => {

  const world = entities.world;
  const scene = entities.scene;

  if (stickController.a && !stickController.previous.a)
  	entities[boxId()] = Box({ parent: scene, world, y: 5 });

  if (stickController.b && !stickController.previous.b)
  	entities[cylinderId()] = Cylinder({ parent: scene, world, y: 5 });

  return entities;
};

export default Spawn;
