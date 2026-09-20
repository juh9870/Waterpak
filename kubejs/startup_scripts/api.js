// priority: 1000

/**
 * @import { RegistryTypes } from "@special/types"
 * @import { MachineGroupData, MachineBlueprint, EventPayload } from "./utils"
 */

const API = {
  /**
   *
   * @param {string} id
   * @returns {MachineBlueprint}
   */
  findBlueprint: (id) => {
    for (const bp of global.BLUEPRINTS) {
      if (bp.id === id) {
        return bp;
      }
    }
    throw new Error("No blueprint is registered with ID '" + id + "'");
  },
};
