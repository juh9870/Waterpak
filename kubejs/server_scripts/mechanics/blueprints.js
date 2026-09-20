//  ========================================================================
// ==========================================================================
// ===  ▗▄▄▖ ▗▄▖ ▗▖  ▗▖▗▄▄▄▖▗▄▄▄▖ ▗▄▄▖▗▖ ▗▖▗▄▄▖  ▗▄▖▗▄▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖ ===
// === ▐▌   ▐▌ ▐▌▐▛▚▖▐▌▐▌     █  ▐▌   ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌ █    █  ▐▌ ▐▌▐▛▚▖▐▌ ===
// === ▐▌   ▐▌ ▐▌▐▌ ▝▜▌▐▛▀▀▘  █  ▐▌▝▜▌▐▌ ▐▌▐▛▀▚▖▐▛▀▜▌ █    █  ▐▌ ▐▌▐▌ ▝▜▌ ===
// === ▝▚▄▄▖▝▚▄▞▘▐▌  ▐▌▐▌   ▗▄█▄▖▝▚▄▞▘▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌ █  ▗▄█▄▖▝▚▄▞▘▐▌  ▐▌ ===
// ==========================================================================
//  ========================================================================

/**
 * Costs for placing various blueprint blocks
 *
 * Items will also drop their listed costs in raw components when broken
 *
 * When blueprint mode is active, blocks can only be placed by paying their
 * cost in ingredients, and the block itself is never consumed.
 *
 * When blueprint mode is inactive, holding the block on off-hand when placing
 * will prevent ingredient usage and will place the block itself. Having more
 * than one of the blocks in stack will also use those blocks instead of
 * ingredients until only the last one is left. Also allows picking up the
 * block directly instead of raw ingredients by holding Create's wrench in
 * off-hand.
 *
 * Syntax is table from the block to table of raw ingredients to their required
 * amounts per block
 * @type {Record<string, Record<string, number>>}
 */
const PLACE_COST = {
  // 'create:gearbox': { 'minecraft:iron_ingot': 3, 'minecraft:stick': 1 },
};

/**
 * A special list of items that place a block with a different name than the
 * item itself. It should map the problematic item to the block placed by it,
 * and the target block should also be registered in PLACE_COST table.
 *
 * @type {Record<string, RegistryTypes.Item>}
 */
const PLACE_ALIASES = {
  'create:vertical_gearbox': 'create:gearbox',
  'create_connected:vertical_six_way_gearbox': 'create_connected:six_way_gearbox',
  'create_connected:vertical_parallel_gearbox': 'create_connected:parallel_gearbox',
};

/**
 * Other options
 */
const PLACE_SCRIPT_OPTS = {
  /**
   * If set to true, will prevent the defined block from being placed in any
   * way except for ingredients, effectively acting only as a "blueprint" for
   * placement`
   *
   * In effect, this will prefent offhand placing or placing when stack got
   * more than one block in it
   *
   * Will also prevent offhand wrench logic from picking up blocks directly
   *
   * @type {boolean}
   */
  blueprintMode: false,

  /**
   * If set to true, the blocks will drop their ingredients when broken/picked
   * up by wrench
   *
   * Holding wrench in off-hand always picks up the block itself unless
   * blueprint mode is active
   *
   * Automatically set to `true` if blueprintMode is active
   *
   * This option requires LootJS
   * @type {boolean}
   */
  bloksDropIngredients: true,

  /**
   * Will print verbose debug logging into console. Better disable before release
   */
  verbose: false,
};

//  ==============================================================================
// ================================================================================
// === ▗▄▄▄▖▗▖  ▗▖▗▄▄▖ ▗▖   ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▄▖▗▄▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖ ===
// ===   █  ▐▛▚▞▜▌▐▌ ▐▌▐▌   ▐▌   ▐▛▚▞▜▌▐▌   ▐▛▚▖▐▌  █ ▐▌ ▐▌ █    █  ▐▌ ▐▌▐▛▚▖▐▌ ===
// ===   █  ▐▌  ▐▌▐▛▀▘ ▐▌   ▐▛▀▀▘▐▌  ▐▌▐▛▀▀▘▐▌ ▝▜▌  █ ▐▛▀▜▌ █    █  ▐▌ ▐▌▐▌ ▝▜▌ ===
// === ▗▄█▄▖▐▌  ▐▌▐▌   ▐▙▄▄▖▐▙▄▄▖▐▌  ▐▌▐▙▄▄▖▐▌  ▐▌  █ ▐▌ ▐▌ █  ▗▄█▄▖▝▚▄▞▘▐▌  ▐▌ ===
// ================================================================================
//  ==============================================================================

for (const group of global.MACHINE_GROUPS) {
  for (const block of group.blocks) {
    if (PLACE_ALIASES[block]) continue;
    PLACE_COST[block] = group.cost;
  }
}

console.log('Registered groups: ', PLACE_COST);

/**
 *
 * @param {import("@package/dev/latvian/mods/kubejs/block").$BlockPlacedKubeEvent} event
 */
BlockEvents.placed((event) => {
  if (!event.player || event.player.isCreative()) return;
  let blockItem = event.block.item;

  let placeCost = PLACE_COST[blockItem.id];
  if (!placeCost) {
    // Not a cost-replacing item
    return;
  }

  // Detect which hand holds the placed block
  let handStack = event.player.getMainHandItem();
  let mappedHandStack = PLACE_ALIASES[handStack.id] ?? handStack.id;
  /**
   * @type {"main_hand" | "off_hand"}
   */
  let hand;

  if (mappedHandStack === blockItem.id) {
    hand = 'main_hand';
  } else if (PLACE_SCRIPT_OPTS.blueprintMode) {
    // item may be in off-hand and direct placement is banned, so need to handle it here
    handStack = event.player.getOffHandItem();
    mappedHandStack = PLACE_ALIASES[handStack.id] ?? handStack.id;
    if (mappedHandStack !== blockItem.id) {
      // Where is the placed block even at?! Just cancel the event and bail
      event.cancel();
      return;
    }
    hand = 'off_hand';
  } else {
    // item not in main hand -> allow normal placement
    return;
  }

  if (handStack.getCount() > 1 && !PLACE_SCRIPT_OPTS.blueprintMode) {
    // Activate components system when only the last item in stack is left or
    // when we are not allowed to place directly
    return;
  }

  if (PLACE_SCRIPT_OPTS.verbose) {
    console.log(
      'placing block ' +
        event.block.block +
        ' with block item ' +
        blockItem.id +
        ' and player main hand stack ' +
        handStack.id +
        ' mapped to ' +
        mappedHandStack +
        'from hand ' +
        hand,
    );
  }

  // Prevent item from being taken
  event.player.setItemInHand(hand, Item.of(handStack, handStack.getCount()));

  let inv = event.player.getInventory().asContainer();
  /**
   * @type {Record<string, number>}
   */
  let missing = {};
  /**
   * @type {[RegistryTypes.Item, number][]}
   */
  let costs = [];
  for (let i of Object.keys(placeCost)) {
    let item = /** @type {RegistryTypes.Item} */ (i);
    let amount = placeCost[item];
    let hasCount = inv.countItem(item);
    if (hasCount < amount) {
      missing[item] = hasCount;
    } else {
      costs.push([item, amount]);
    }
  }

  if (Object.keys(missing).length > 0) {
    /** @type {import("@package/net/minecraft/network/chat").$Component_[]} */
    let msg = [{ text: 'Not enough items to build ', color: 'yellow' }, Item.of(mappedHandStack).displayName];
    for (let item of Object.keys(placeCost)) {
      let requiredCount = placeCost[item];
      let hasAmount = missing[item] ?? requiredCount;
      let color = hasAmount === requiredCount ? 'green' : 'red';
      msg.push(
        {
          color: color,
          text: '\n    ' + hasAmount + '/' + requiredCount + ' ',
        },
        Item.of(/** @type {RegistryTypes.Item} */ (item)).displayName,
      );
    }

    event.player.displayClientMessage(msg, false);

    event.player.inventoryMenu.broadcastFullState();
    event.cancel();
    return;
  }

  while (costs.length > 0) {
    let [item, amount] = costs[costs.length - 1];
    let slot = inv.find(item);
    let extracted = inv.extractItem(slot, amount, false);
    let count = extracted.getCount();
    if (count === 0) {
      throw new Error(
        'Failed to extract ' +
          amount +
          'x of item ' +
          item +
          ' from slot ' +
          slot +
          ' from player ' +
          event.player.getName(),
      );
    }
    if (count === amount) {
      costs.pop();
    } else {
      costs[costs.length - 1] = [item, amount - count];
    }
  }
  event.player.inventoryMenu.broadcastFullState();
});

if (PLACE_SCRIPT_OPTS.blueprintMode || PLACE_SCRIPT_OPTS.bloksDropIngredients) {
  // Simple stuff for nice-playing blocks - just patch the loot table ( ˶ˆᗜˆ˵ )
  LootJS.lootTables((event) => {
    for (let key of Object.keys(PLACE_COST)) {
      let table = event.getBlockTable(/** @type {RegistryTypes.Block} */ (key));
      let cost = PLACE_COST[key];
      table.clear();
      for (let item of Object.keys(cost)) {
        table.createPool((p) => {
          let amount = cost[item];
          p.addEntry(LootEntry.of(Item.of(/** @type {RegistryTypes.Item} */ (item), amount)));
        });
      }
    }
  });

  // Hard stuff .·°՞(≧□≦)՞°·.
  BlockEvents.broken((event) => {
    let cost = PLACE_COST[event.block.id];
    if (!cost) return;
    let drops = event.block.getDrops();

    let entity = /** @type {import("@package/net/minecraft/world/entity").$Entity} */ (
      /** @type {unknown} */ (event.player)
    );

    // No offhand pickup in this pack
    //
    // offhand wrench allows picking up blocks directly except for blueprint mode
    // if (event.player && !PLACE_SCRIPT_OPTS.blueprintMode && event.player.getOffHandItem().id === 'create:wrench') {
    //   if (drops.size() === 1 && PLACE_ALIASES[drops.get(0).id]) {
    //     // drop is from one of the hardcoded blocks, so don't care and let it work
    //     return;
    //   }

    //   // give the item directly instead of drops
    //   event.player.give(event.block.item);
    //   event.level.destroyBlock(event.block.pos, false, entity);
    //   event.cancel();
    //   return;
    // }

    if (drops.size() === 1) {
      let mappedBlock = PLACE_ALIASES[drops.get(0).id];

      if (mappedBlock) {
        if (event.player && event.player.getMainHandItem().id === 'create:wrench') {
          let costs = PLACE_COST[mappedBlock];
          for (let item of Object.keys(costs)) {
            let amount = costs[item];
            event.player.give(Item.of(/** @type {RegistryTypes.Item} */ (item), amount));
          }
          event.level.destroyBlock(event.block.pos, false, entity);
          event.cancel();
        } else {
          event.level.setBlock(event.block.pos, mappedBlock, 4 | 16 | 32);
          event.level.destroyBlock(event.block.pos, true, entity);
          event.cancel();
        }
      }
    }
  });
}
