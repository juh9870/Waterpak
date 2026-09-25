/**
 * @return {ClickRecipe[]}
 */
function clickRepairRecipes() {
  /**
   * @type {ClickRecipe[]}
   */
  let recipes = [];

  /**
   *
   * @param {RegistryTypes.Item} item
   * @param {[IngredientInfo, number][]} material
   * @param {number} count
   */
  function newRecipe(item, material, count) {
    recipes.push({
      bottomItem: item,
      action: (event) => {
        console.log('tool repair');
        let tool = event.stackedOnItem;
        if (tool.getDamageValue() === 0) {
          console.log('tool not damaged');
          return false;
        }

        let mult = -1;
        for (const pair of material) {
          if (Ingredient.of(pair[0]).testItem(event.carriedItem.id)) mult = pair[1];
        }
        if (mult <= 0) {
          console.log('wrong material');
          return false;
        }

        tool = tool.copy();
        let repairAmount = Math.ceil((tool.getMaxDamage() / count) * mult);
        tool.setDamage(Math.max(tool.getDamageValue() - repairAmount, 0));
        event.slot.set(tool);
        event.carriedItem.setCount(event.carriedItem.getCount() - 1);

        return true;
      },
    });
  }

  /**
   *
   * @param {string} modid
   * @param {string} materialName
   * @param {[IngredientInfo, number][]} materialItem
   * @param {number} [customAmount]
   */
  function toolset(modid, materialName, materialItem, customAmount) {
    let base = modid + ':' + materialName;
    /**
     * @type {[string, number][]}
     */
    let items = [
      [base + '_shovel', 1],
      [base + '_pickaxe', 3],
      [base + '_axe', 3],
      [base + '_hoe', 2],
      [base + '_sword', 2],
      [base + '_helmet', 5],
      [base + '_chestplate', 8],
      [base + '_leggings', 7],
      [base + '_boots', 4],
    ];

    for (const pair of items) {
      let item = pair[0];
      if (!API.itemExists(item)) continue;
      newRecipe(item, materialItem, customAmount ?? pair[1]);
    }
  }

  toolset('minecraft', 'wooden', [['#minecraft:planks', 1]]);
  toolset('minecraft', 'stone', [['#minecraft:stone_tool_materials', 1]]);
  toolset('minecraft', 'iron', [
    ['minecraft:iron_ingot', 1],
    ['minecraft:iron_nugget', 1 / 9],
  ]);
  toolset('minecraft', 'golden', [
    ['minecraft:gold_ingot', 1],
    ['minecraft:gold_nugget', 1 / 9],
  ]);
  toolset('minecraft', 'diamond', [['minecraft:diamond', 1]]);
  toolset('minecraft', 'netherite', [['minecraft:netherite_ingot', 1]], 1);

  return recipes;
}
