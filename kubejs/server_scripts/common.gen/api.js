// priority: 1000

/**
 * @import { RegistryTypes } from "@special/types"
 * @import { $ItemStackKJS } from '@package/dev/latvian/mods/kubejs/core'
 * @import { $Enchantment } from '@package/net/minecraft/world/item/enchantment'
 * @import { $ItemStack_ as ItemStack, $ItemStack } from '@package/net/minecraft/world/item'
 * @import { $Ingredient_ as IngredientInfo } from "@package/net/minecraft/world/item/crafting"
 * @import { $ItemEnchantments$Mutable as EnchantmentsMutable, $EnchantmentHelper as EnchantmentHelper, $Enchantment as Enchantment } from '@package/net/minecraft/world/item/enchantment'
 * @import { $Holder } from '@package/net/minecraft/core'
 * @import { $MinecraftServer } from "@package/net/minecraft/server"
 * @import { MachineGroupData, MachineBlueprint, EventPayload, RecipeInventoryItemClick, TagGrouping } from "./types"
 */

const API = {
  /**
   * Returns blueprint ID for this item in a group
   *
   * @param {string} group
   * @param {RegistryTypes.Item} item
   * @return {RegistryTypes.Item}
   */
  blueprintForItem: (group, item) => {
    let bp = API._blueprintForItemUnchecked(group, item);
    if (!global.KNOWN_BLUEPRINTS[bp]) {
      throw new Error("There is no blueprint for item '" + item + "' of group '" + group + "'");
    }
    return bp;
  },

  /**
   * @param {string} group
   * @param {RegistryTypes.Item} item
   * @return {RegistryTypes.Item}
   */
  _blueprintForItemUnchecked: (group, item) => {
    let parts = item.split(':');
    return /** @type {RegistryTypes.Item} */ ('kubejs:blueprint/' + group + '/' + parts[1]);
  },

  /**
   * Extracts all items from the inggredient into a `target` array or a new array and returns it
   *
   * When using item tags, returned items will depend on the current event and
   * stage of loading. Generally tags should only be expected to exist in the
   * recipes event or at runtime
   * @param {IngredientInfo} ingr
   * @param {RegistryTypes.Item[]} [target]
   * @return {RegistryTypes.Item[]}
   */
  itemIdsFor: (ingr, target) => {
    /**
     * @type {string[]}
     */
    let ids = target ?? [];
    Ingredient.of(ingr).itemIds.forEach((id) => {
      const sid = String(id);
      if (sid !== 'minecraft:barrier') ids.push(sid);
    });
    return /** @type {RegistryTypes.Item[]} */ (ids);
  },
};
