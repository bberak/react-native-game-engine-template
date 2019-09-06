const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.gamepadController = args.gamepadController;
  }

  return entities;
};

export default HUD;