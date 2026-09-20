let $ItemStackedOnOtherEvent = Java.loadClass('net.neoforged.neoforge.event.ItemStackedOnOtherEvent');

/**
 * @typedef {EventPayload<typeof $ItemStackedOnOtherEvent>} StackedEventData
 */

/**
 * @typedef ClickRecipe
 *
 * @property {RegistryTypes.Item} bottomItem
 * @property {(event:StackedEventData) => boolean} action
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

  // function

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
    if (r.action(event)) {
      event.setCanceled(true);
      return;
    }
  }
};

NativeEvents.onEvent($ItemStackedOnOtherEvent, (event) => {
  handleItemClickEvent(event);
});
