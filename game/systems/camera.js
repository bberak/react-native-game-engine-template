import { rotateAroundPoint } from "../utils/three";

const Camera = ({
  yawSpeed = 0.01,
  pitchSpeed = 0.01,
  zoomSpeed = 0.02
} = {}) => {
  return (entities, { touchController }) => {
    const camera = entities.camera;

    if (camera && touchController) {
      //-- Yaw and pitch rotation
      if (touchController.multiFingerMovement.x || touchController.multiFingerMovement.y) {
        rotateAroundPoint(camera, camera.target, {
          y: touchController.multiFingerMovement.x * yawSpeed,
          x: touchController.multiFingerMovement.y * pitchSpeed
        });
        camera.lookAt(camera.target);
      }
      
      //-- Zooming (pinching)
      if (touchController.pinch) {
        const zoomFactor = touchController.pinch * zoomSpeed;

        camera.zoom += zoomFactor;
        camera.updateProjectionMatrix();
      }
    }

    return entities;
  };
};

export default Camera;
