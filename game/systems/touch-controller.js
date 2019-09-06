import _ from "lodash";

const neutral = { x: 0, y: 0 };

const singleFingerMovement = moves => {
  if (moves.length === 1) {
    const f1 = moves[0];

    return {
      x: f1.delta.locationX,
      y: f1.delta.locationY
    };
  }

  return neutral;
};

const multiFingerMovement = moves => {
  if (moves.length > 1) {
    const f1 = moves[0];
    const f2 = moves[1];

    return {
      x: (f1.delta.locationX + f2.delta.locationX) / 2,
      y: (f1.delta.locationY + f2.delta.locationY) / 2
    };
  }

  return neutral;
};

const pinch = (moves, pinchThreshold) => {
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

const find = type => touches => {
  const found = touches.find(x => x.type === type)

  if (found)
    return found.event;
}

const press = find("press");

const start = find("start")

let previous = {};

const TouchController = ({ pinchThreshold = 150 } = {}) => (Wrapped = x => x) => (entities, args) => {
  if (!args.touchController) {
    const touches = args.touches;
    const moves = _.uniqBy(touches.filter(x => x.type === "move"), x => x.event.identifier);
    
    const current = {
      singleFingerMovement: singleFingerMovement(moves),
      multiFingerMovement: multiFingerMovement(moves),
      pinch: pinch(moves, pinchThreshold),
      press: press(touches),
      start: start(touches)
    };

    args.touchController = Object.assign(
      {},
      current,
      { previous }
    );

    previous = current;
  }

  return Wrapped(entities, args);
};

export default TouchController;
