import Box from "../components/box"
import Cylinder from "../components/cylinder"
import { id } from "../utils";

const boxId = (id => () => id("box"))(id(0));
const cylinderId = (id => () => id("cylinder"))(id(0));

const Spawn = (entities, { gamepadController }) => {

  const world = entities.world;
  const scene = entities.scene;

  if (gamepadController.a && !gamepadController.previous.a)
  	entities[boxId()] = Box({ parent: scene, world, y: 5 });

  if (gamepadController.b && !gamepadController.previous.b)
  	entities[cylinderId()] = Cylinder({ parent: scene, world, y: 5 });

  return entities;
};

export default Spawn;
