ServerEvents.recipes((event) => {
  for (const group of global.MACHINE_GROUPS) {
    // const blueprint = API.findBlueprint(group.blueprint);
    let ingredients = [];
    let totalCost = 0;
    for (let item of Object.keys(group.cost)) {
      let count = group.cost[item];
      totalCost += count;
      for (let i = 0; i < count; i++) ingredients.push({ item: item });
    }
    let minTier = totalCost <= 9 ? 0 : 2;
    for (const bl of group.blocks) {
      event.remove({ output: bl });
      let bp = API.blueprintForItem(group.id, bl);
      // event.recipes.oraculumworktables.engineer_shapeless(bl, ingredients).secondaryIngredients([bp]);
      event.custom({
        type: 'oraculumworktables:engineer_shapeless',
        result: Item.of(bl).toJson(),
        ingredients: ingredients,
        secondaryIngredients: [{ item: bp }],
        consumeSecondaryIngredients: false,
        minimumTier: minTier,
        group: group.id,
      });
    }
  }
});
