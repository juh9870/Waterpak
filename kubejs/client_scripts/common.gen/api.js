// priority: 1000

/**
 * @import { RegistryTypes } from "@special/types"
 * @import { $ItemStack_ as ItemStack } from '@package/net/minecraft/world/item'
 * @import { MachineGroupData, MachineBlueprint, EventPayload, RecipeInventoryItemClick } from "./types"
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
};
