let $ItemStackedOnOtherEvent = Java.loadClass('net.neoforged.neoforge.event.ItemStackedOnOtherEvent');

/**
 * @typedef {EventPayload<typeof $ItemStackedOnOtherEvent>} StackedEventData
 */

/**
 * @typedef ClickRecipe
 *
 * @property {RegistryTypes.Item} bottomItem
 * @property {RegistryTypes.Item} [heldItem]
 * @property {0|1} [clickAction]
 * @property {(event:StackedEventData) => boolean} action - returns true if action handled the event and no forther events shall be processed
 */

/**
 * @type {Record<string, ClickRecipe[]> | null}
 */
let clickRecipeCache = null;

/**
 * @return {Record<string, ClickRecipe[]>}
 */
let populateClickRecipeCache = () => {
  clickRecipeCache = {};

  /**
   *
   * @param {RecipeInventoryItemClick} recipe
   */
  function eventForRecipe(recipe) {
    /**
     * @param {StackedEventData} event
     */
    return (event) => {
      switch (recipe.itemAction[0]) {
        case 'keep':
          break;
        case 'consume':
          event.slot.remove(event.slot.item.getCount());
          break;
        case 'damage':
          event.slot.item.setDamageValue(
            event.slot.item.getDamageValue() + /** @type {number} */ (recipe.itemAction[1]),
          );
          break;
        case 'transform': {
          let stack = /** @type {ItemStack} */ (recipe.itemAction[1]);
          if (event.slot.item.getCount() === 1) {
            event.slot.set(stack);
          } else {
            event.slot.remove(1);
            event.player.give(stack);
          }
          break;
        }
      }
      if (recipe.heldItemAction) {
        switch (recipe.heldItemAction[0]) {
          case 'keep':
            break;
          case 'consume':
            event.carriedItem.setCount(0);
            break;
          case 'damage':
            event.carriedItem.setDamageValue(
              event.carriedItem.getDamageValue() + /** @type {number} */ (recipe.itemAction[1]),
            );
            break;
          case 'transform': {
            let stack = /** @type {ItemStack} */ (recipe.itemAction[1]);
            if (event.carriedItem.getCount() === 1) {
              event.carriedSlotAccess.set(stack);
            } else {
              event.carriedItem.setCount(event.carriedItem.getCount() - 1);
              event.player.give(stack);
            }
            break;
          }
        }
      }
      return true;
    };
  }

  for (const recipe of global.RECIPE_INVENTORY_ITEM_CLICK) {
    let c = clickRecipeCache[recipe.item] ?? [];
    clickRecipeCache[recipe.item] = c;
    c.push({
      bottomItem: recipe.item,
      heldItem: recipe.heldItem,
      clickAction: recipe.clickAction === 'primary' ? 0 : recipe.clickAction === 'secondary' ? 1 : undefined,
      action: eventForRecipe(recipe),
    });
  }

  for (const recipe of clickEnchantmentRecipes()) {
    let c = clickRecipeCache[recipe.bottomItem] ?? [];
    clickRecipeCache[recipe.bottomItem] = c;
    c.push(recipe);
  }

  return clickRecipeCache;
};

/**
 * @param {EventPayload<typeof $ItemStackedOnOtherEvent>} event
 */
let handleItemClickEvent = (event) => {
  let cache = clickRecipeCache ?? populateClickRecipeCache();

  let recipes = cache[event.slot.item.id];
  if (!recipes || recipes.length === 0) return;

  for (const r of recipes) {
    if (r.heldItem && r.heldItem !== event.carriedItem.id) continue;
    if (r.clickAction && r.clickAction !== event.clickAction.ordinal()) continue;
    if (r.action(event)) {
      event.setCanceled(true);
      return;
    }
  }
};

NativeEvents.onEvent($ItemStackedOnOtherEvent, (event) => {
  handleItemClickEvent(event);
});
