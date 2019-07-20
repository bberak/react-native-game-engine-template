const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.stickController = args.stickController;
  }

  return entities;
};

export default HUD;