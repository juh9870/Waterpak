// !!Generated file, do not edit!!! Edit this file in startup_scripts
// priority: 1000

/**
 * @import { RegistryTypes } from "@special/types"
 * @import { MachineGroupData, MachineBlueprint, EventPayload } from "./utils.gen"
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
