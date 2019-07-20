import { screen } from "./index";

const padding = 10;

const stickRadius = 50;
const stickPosition = {
  x: stickRadius + padding,
  y: screen.height - stickRadius - padding
};

const aRadius = 25;
const aPosition = {
  x: screen.width - aRadius * 2.75 - padding,
  y: screen.height - aRadius - padding
};

const bRadius = 25;
const bPosition = {
  x: screen.width - bRadius - padding,
  y: screen.height - bRadius * 2.75 - padding
};

const x = (point, touch) => {
  return touch.event.pageX - point.x;
};

const y = (point, touch) => {
  return touch.event.pageY - point.y;
};

const distance = (point, touch) => {
  return Math.hypot(x(point, touch), y(point, touch));
};

const vector = (point, touch) => {
  return { x: x(point, touch), y: y(point, touch) };
};

const clamp = (point, radius) => {
  const d = Math.hypot(point.x, point.y);

  if (d < radius)
    return point;

    return {
      x: point.x * (radius / d),
      y: point.y * (radius / d)
    }
};

const normalize = (point, radius) => {
  return {
    x: point.x / radius,
    y: -point.y / radius
  }
}

const isTouching = (point, proxmity) => {
  let touching = false;
  let id = null;

  return touches => {
    if (!touching) {
      const down = touches.find(
        t =>
          (t.type == "start" || t.type == "move") &&
          distance(point, t) < proxmity
      );

      if (down) {
        touching = true;
        id = down.event.identifier;
      }
    } else {
      const up =
        touches.find(t => t.type == "end" && t.event.identifier == id) ||
        touches.find(
          t =>
            t.type == "move" &&
            t.event.identifier == id &&
            distance(point, t) > proxmity
        );

      if (up) {
        touching = false;
        id = null;
      }
    }

    return touching;
  };
};

const trackDistanceFrom = (point, radius, proxmity) => {
  let touch = null;
  let id = null;

  return touches => {
    if (!touch) {
      const down = touches.find(
        t =>
          (t.type == "start" || t.type == "move") &&
          distance(point, t) < proxmity
      );

      if (down) {
        const vec = vector(point, down);
        const clamped = clamp(vec, radius);

        touch = normalize(clamped, radius);
        id = down.event.identifier;
      }
    } else {
      const move = touches.find(
        t =>
          t.type == "move" &&
          t.event.identifier == id &&
          distance(point, t) < proxmity
      );

      if (move) {
        const vec = vector(point, move);
        const clamped = clamp(vec, radius);
        
        touch = normalize(clamped, radius);
      } else {
        const up =
          touches.find(t => t.type == "end" && t.event.identifier == id) ||
          touches.find(
            t =>
              t.type == "move" &&
              t.event.identifier == id &&
              distance(point, t) > proxmity
          );

        if (up) {
          touch = null;
          id = null;
        }
      }
    }

    return touch;
  };
};

const isTouchingA = isTouching(aPosition, aRadius + 20);
const isTouchingB = isTouching(bPosition, bRadius + 20);
const trackDistanceFromStick = trackDistanceFrom(stickPosition, stickRadius, stickRadius + 40)

let previous = {};

const StickController = (Wrapped = x => x) => (entities, args) => {
  if (!args.stickController) {
    const current = {
      ...trackDistanceFromStick(args.touches),
      a: isTouchingA(args.touches),
      b: isTouchingB(args.touches)
    };

    args.stickController = Object.assign(
      { stickRadius, stickPosition, aRadius, aPosition, bRadius, bPosition },
      current,
      { previous }
    );

    previous = current;
  }

  return Wrapped(entities, args);
};

export default StickController;
