import { Vector2 } from "three";
import { rotateAroundPoint } from "../utils/three";

const CameraControls = ({
  yawSpeed = 0.01,
  pitchSpeed = 0.01,
  zoomSpeed = 0.02,
  pinchThreshold = 150
} = {}) => {
  return (entities, { touches }) => {
    const camera = entities.camera;
    const moves = touches.filter(x => x.type == "move");

    if (camera && moves.length > 1) {
      const finger1 = moves[0];
      const finger2 = moves[1];

      //-- Yaw and pitch rotation
      const deltaX = (finger1.delta.locationX + finger2.delta.locationX) / 2;
      const deltaY = (finger1.delta.locationY + finger2.delta.locationY) / 2;

      rotateAroundPoint(camera, camera.target, {
        thetaY: deltaX * yawSpeed,
        thetaX: deltaY * pitchSpeed
      });
      camera.lookAt(camera.target);

      //-- Zooming (pinching)
      const f1Location = new Vector2(
        finger1.event.locationX,
        finger1.event.locationY
      );
      const f1PreviousLocation = f1Location
        .clone()
        .sub(new Vector2(finger1.delta.locationX, finger1.delta.locationY));
      const f2Location = new Vector2(
        finger2.event.locationX,
        finger2.event.locationY
      );
      const f2PreviousLocation = f2Location
        .clone()
        .sub(new Vector2(finger2.delta.locationX, finger2.delta.locationY));
      const currentDistance = f1Location.distanceTo(f2Location);
      const previousDistance = f1PreviousLocation.distanceTo(
        f2PreviousLocation
      );

      if (currentDistance > pinchThreshold) {
        const zoomFactor = (currentDistance - previousDistance) * zoomSpeed;

        camera.zoom += zoomFactor;
        camera.updateProjectionMatrix();
      }
    }

    return entities;
  };
};

export default CameraControls;
