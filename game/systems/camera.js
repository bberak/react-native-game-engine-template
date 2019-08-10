import { rotateAroundPoint } from "../utils/three";

const Camera = ({
  yawSpeed = 0.01,
  pitchSpeed = 0.01,
  zoomSpeed = 0.02
} = {}) => {
  return (entities, { swipeController }) => {
    const camera = entities.camera;

    if (camera && swipeController) {
      //-- Yaw and pitch rotation
      if (swipeController.twoFingersX || swipeController.twoFingersY) {
        rotateAroundPoint(camera, camera.target, {
          thetaY: swipeController.twoFingersX * yawSpeed,
          thetaX: swipeController.twoFingersY * pitchSpeed
        });
        camera.lookAt(camera.target);
      }
      
      //-- Zooming (pinching)
      if (swipeController.pinch) {
        const zoomFactor = swipeController.pinch * zoomSpeed;

        camera.zoom += zoomFactor;
        camera.updateProjectionMatrix();
      }
    }

    return entities;
  };
};

export default Camera;
