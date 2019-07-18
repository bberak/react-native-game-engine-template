const readKey = (input, keys, name) => input.find(x => x.name === name && keys.indexOf(x.payload.key) !== -1);

const createKeyReader = keys => {
  let down = false;

  return input => {
    if (readKey(input, keys, "onKeyDown"))
      down = true;
    
    if (readKey(input, keys, "onKeyUp"))
      down = false;

    return down;
  }
};

const getGamepad = () => navigator.getGamepads()[0] || navigator.getGamepads()[1] || navigator.getGamepads()[2] || navigator.getGamepads()[3];

const vibrate = gp => {
  return effect => {
    if (gp && gp.vibrationActuator)
      gp.vibrationActuator.playEffect("dual-rumble", effect);
  };
};

const createGamepadButtonReader = (buttonIndices = [], threshold = 0) => {
  return gp => {
    if (gp) {

      const idx = buttonIndices.find(x => gp.buttons[x] && gp.buttons[x].pressed && gp.buttons[x].value > threshold);

      return gp.buttons[idx];
    }
  }
};

const createGamepadAxesReader = (axisIndices = [], cond = val => Math.abs(val) > 0.1) => {
  return gp => {
    if (gp) {

      const idx = axisIndices.find(x => gp.axes[x] && cond(gp.axes[x], axisIndices.map(y => gp.axes[y])));

      return gp.axes[idx];
    }
  }
};

const leftKey = createKeyReader(["a", "A", "ArrowLeft"]);
const rightKey = createKeyReader(["d", "D", "ArrowRight"]);
const forwardKey = createKeyReader(["w", "W", "ArrowUp"]);
const spaceKey = createKeyReader([" ", "Control"]);
const triggers = createGamepadButtonReader([6, 7]);
const stickLeft = createGamepadAxesReader([0], val => val < -0.1);
const stickRight = createGamepadAxesReader([0], val => val > 0.1);
const stickUp = createGamepadAxesReader([3], val => val < -0.5);

let previous = { };

const Controller = (Wrapped = x => x) => (entities, args) => {

  if (!args.controller) {
      const gamepad = getGamepad();

      const current = {
        left: leftKey(args.input) || stickLeft(gamepad),
        right: rightKey(args.input) || stickRight(gamepad),
        accelerate: forwardKey(args.input) || stickUp(gamepad),
        fire: spaceKey(args.input) || triggers(gamepad),
        vibrate: vibrate(gamepad)
      };

      args.controller = Object.assign({}, current, { previous });

      previous = current;
  }

  return Wrapped(entities, args);
};

export default Controller;