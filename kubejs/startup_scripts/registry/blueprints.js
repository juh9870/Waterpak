StartupEvents.registry('item', (event) => {
  for (const bp of global.BLUEPRINTS) {
    event.create(bp.item).texture('kubejs:item/blueprint').unstackable();
  }
});
