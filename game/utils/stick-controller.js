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

let previous = {};

const StickController = (Wrapped = x => x) => (entities, args) => {
  if (!args.stickController) {
    const current = {
      x: -1,
      y: 1,
      a: true,
      b: false
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
