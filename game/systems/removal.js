import { remove } from "../utils";
import { Frustum, Matrix4 } from "three";
import _ from "lodash";

//-- https://gist.github.com/zentrope/5022d89cfa995ac71978

const frustum = new Frustum();
const cameraViewProjectionMatrix = new Matrix4();

const Removal = entities => {
  const camera = entities.camera;
  const removeableKeys = Object.keys(entities).filter(
    x => entities[x].removable
  );

  camera.updateMatrixWorld();
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  cameraViewProjectionMatrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromMatrix(cameraViewProjectionMatrix);

  removeableKeys.forEach(key => {
    const test = entities[key].removable;

    if (_.isFunction(test) ? test(frustum, entities[key], entities) : true)
      remove(entities, key);
  });

  return entities;
};

export default Removal;
