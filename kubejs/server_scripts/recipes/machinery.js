ServerEvents.recipes((event) => {
  for (const group of global.MACHINE_GROUPS) {
    const blueprint = API.findBlueprint(group.blueprint);
    for (const bl of group.blocks) {
      // event.recipes.oraculumworktables.
    }
  }
});
