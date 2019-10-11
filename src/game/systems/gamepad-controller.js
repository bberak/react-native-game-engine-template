import { screen } from "../utils/index";
import { Vibration } from 'react-native';

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

const distance = (touch, pos) => {
  return Math.hypot(touch.event.pageX - pos.x, touch.event.pageY - pos.y);
};

const subtract = (touch, pos) => {
  return { x: touch.event.pageX - pos.x, y: touch.event.pageY - pos.y };
};

const clamp = (vec, radius) => {
  const dist = Math.hypot(vec.x, vec.y);

  if (dist < radius)
    return vec;

    return {
      x: vec.x * (radius / dist),
      y: vec.y * (radius / dist)
    }
};

const normalize = (vec, radius) => {
  return {
    x: vec.x / radius,
    y: vec.y / radius,
    heading: Math.atan2(vec.y, vec.x)
  }
}

const isTouchingPosition = (pos, proxmity) => {
  let touching = false;
  let id = null;

  return touches => {
    if (!touching) {
      const down = touches.find(
        t =>
          (t.type === "start" || t.type === "move") &&
          distance(t, pos) < proxmity
      );

      if (down) {
        touching = true;
        id = down.event.identifier;
      }
    } else {
      const up =
        touches.find(t => t.type === "end" && t.event.identifier == id) ||
        touches.find(
          t =>
            t.type === "move" &&
            t.event.identifier === id &&
            distance(t, pos) > proxmity
        );

      if (up) {
        touching = false;
        id = null;
      }
    }

    return touching;
  };
};

const neutral = { x: 0, y: 0, heading: null };

const trackNormalFromPosition = (pos, radius, proxmity) => {
  let normal = null;
  let id = null;

  return touches => {
    if (!normal) {
      const down = touches.find(
        t =>
          (t.type === "start" || t.type === "move") &&
          distance(t, pos) < proxmity
      );

      if (down) {
        const vec = subtract(down, pos);
        const clamped = clamp(vec, radius);

        normal = normalize(clamped, radius);
        id = down.event.identifier;
      }
    } else {
      const move = touches.find(
        t =>
          t.type === "move" &&
          t.event.identifier === id &&
          distance(t, pos) < proxmity
      );

      if (move) {
        const vec = subtract(move, pos);
        const clamped = clamp(vec, radius);
        
        normal = normalize(clamped, radius);
      } else {
        const up =
          touches.find(t => t.type === "end" && t.event.identifier === id) ||
          touches.find(
            t =>
              t.type === "move" &&
              t.event.identifier === id &&
              distance(t, pos) > proxmity
          );

        if (up) {
          normal = null;
          id = null;
        }
      }
    }

    return normal || neutral;
  };
};

const vibrate = (patternOrDuration, repeat) => {
    Vibration.vibrate(patternOrDuration, repeat);
};

const isTouchingA = isTouchingPosition(aPosition, aRadius + 20);
const isTouchingB = isTouchingPosition(bPosition, bRadius + 20);
const trackNormalFromStick = trackNormalFromPosition(stickPosition, stickRadius, stickRadius + 40)

let previous = {};

const GamepadController = (Wrapped = x => x) => (entities, args) => {
  if (!args.gamepadController) {
    const current = {
      ...trackNormalFromStick(args.touches),
      a: isTouchingA(args.touches),
      b: isTouchingB(args.touches),
      vibrate
    };

    args.gamepadController = Object.assign(
      { stickRadius, stickPosition, aRadius, aPosition, bRadius, bPosition },
      current,
      { previous }
    );

    previous = current;
  }

  return Wrapped(entities, args);
};

export default GamepadController;
