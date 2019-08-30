import _ from "lodash";

const oneFingerNeutral = { oneFingerX: 0, oneFingerY: 0 };

const getOneFingerMovement = moves => {
  if (moves.length === 1) {
    const f1 = moves[0];

    const oneFingerX = f1.delta.locationX;
    const oneFingerY = f1.delta.locationY;

    return {
      oneFingerX,
      oneFingerY
    };
  }

  return oneFingerNeutral;
};

const twoFingersNeutral = { twoFingersX: 0, twoFingersY: 0 };

const getTwoFingerMovement = moves => {
  if (moves.length === 2) {
    const f1 = moves[0];
    const f2 = moves[1];

    const twoFingersX = (f1.delta.locationX + f2.delta.locationX) / 2;
    const twoFingersY = (f1.delta.locationY + f2.delta.locationY) / 2;

    return {
      twoFingersX,
      twoFingersY
    };
  }

  return twoFingersNeutral;
};

const getPinch = (moves, pinchThreshold) => {
  if (moves.length === 2) {

    const f1 = moves[0];
    const f2 = moves[1];

    const f1Pos = { x: f1.event.pageX,  y: f1.event.pageY };
    const f1PosPrev = { x: f1Pos.x - f1.delta.pageX,  y: f1Pos.y - f1.delta.pageY };

    const f2Pos = { x: f2.event.pageX,  y: f2.event.pageY };
    const f2PosPrev = { x: f2Pos.x - f2.delta.pageX,  y: f2Pos.y - f2.delta.pageY };

    const currentDistance = Math.hypot(f1Pos.x - f2Pos.x, f1Pos.y - f2Pos.y);
    const previousDistance = Math.hypot(f1PosPrev.x - f2PosPrev.x, f1PosPrev.y - f2PosPrev.y)

    if (currentDistance > pinchThreshold)
      return currentDistance - previousDistance;
  }

  return 0;
};

let previous = {};

const SwipeController = ({ pinchThreshold = 150 } = {}) => (Wrapped = x => x) => (entities, args) => {
  if (!args.swipeController) {
    const moves = _.uniqBy(args.touches.filter(x => x.type === "move"), x => x.event.identifier);
    const current = {
      ...getOneFingerMovement(moves),
      ...getTwoFingerMovement(moves),
      pinch: getPinch(moves, pinchThreshold)
    };

    args.swipeController = Object.assign(
      {},
      current,
      { previous }
    );

    previous = current;
  }

  return Wrapped(entities, args);
};

export default SwipeController;
