// priority: 999

global.MACHINE_GROUPS = [];
global.BLUEPRINTS = [];
global.KNOWN_BLUEPRINTS = {};
global.RECIPE_INVENTORY_ITEM_CLICK = [];
global.TAG_GROUPINGS = {};
global.ITEM_FLIPS = [];

const REG = {
  /**
   * @param {MachineGroupData} group
   */
  machineGroup: (group) => {
    for (const g of global.MACHINE_GROUPS) {
      if (g.id === group.id) {
        throw new Error("Group with ID '" + group.id + "' is already registered");
      }
    }
    global.MACHINE_GROUPS.push(group);
    let bps = [REG.blueprint(/** @type {RegistryTypes.Item} */ ('kubejs:blueprint/' + group.id))];
    for (const item of group.blocks) {
      bps.push(REG.blueprint(API._blueprintForItemUnchecked(group.id, item)));
    }

    REG.tagGroup('kubejs:blueprint/' + group.id, bps);
    REG.tagGroup('kubejs:machinery/' + group.id, group.blocks);

    for (let i = 0; i < bps.length; i++) {
      let next = (i + 1) % bps.length;
      // console.log('blueprints cycle recipe:' + bps[i] + ' into ' + bps[next]);
      global.RECIPE_INVENTORY_ITEM_CLICK.push({
        item: bps[i],
        heldItem: 'minecraft:air',
        clickAction: 'secondary',
        itemAction: ['transform', bps[next]],
      });
    }
  },

  /**
   * @param {RegistryTypes.Item} id
   * @returns {RegistryTypes.Item}
   */
  blueprint: (id) => {
    let bp = {
      item: id,
    };
    global.BLUEPRINTS.push(bp);
    global.KNOWN_BLUEPRINTS[id] = bp;
    return id;
  },

  /**
   *
   * @param {RegistryTypes.ItemTag | string} tag
   * @param {TagGrouping | (RegistryTypes.Item[])} group
   */
  tagGroup: (tag, group) => {
    if (Array.isArray(group)) {
      group = {
        items: group,
        recipesWhitelist: [],
      };
    }
    if (!group.recipesWhitelist) {
      group.recipesWhitelist = [];
    }
    global.TAG_GROUPINGS[tag] = group;
  },
};
