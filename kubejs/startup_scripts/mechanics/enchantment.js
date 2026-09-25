/**
 * @return {ClickRecipe[]}
 */
function clickEnchantmentRecipes() {
  /**
   * @type {typeof EnchantmentsMutable}
   */
  const $ItemEnchantments$Mutable = Java.loadClass('net.minecraft.world.item.enchantment.ItemEnchantments$Mutable');
  /**
   * @type {typeof EnchantmentHelper}
   */
  const $EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper');
  /**
   * @type {typeof Enchantment}
   */
  const $Enchantment = Java.loadClass('net.minecraft.world.item.enchantment.Enchantment');

  /**
   * @type {ClickRecipe[]}
   */
  let recipes = [];

  /**
   *
   * @param {$ItemStack} item
   * @param {EnchantmentsMutable} itemEnchants
   * @param {$Holder<$Enchantment>} enchant
   */
  function supportsEnchantment(item, itemEnchants, enchant) {
    if (item.id === 'minecraft:book' || item.id === 'minecraft:enchanted_book') return true;
    if (!item.supportsEnchantment(enchant)) return false;
    for (let existing of itemEnchants.keySet()) {
      if (!existing.equals(enchant) && !$Enchantment.areCompatible(enchant, existing)) return false;
    }
    return true;
  }

  /**
   *
   * @param {$ItemStack} item
   * @param {EnchantmentsMutable} itemEnchants
   * @param {$Holder<$Enchantment>} enchant
   * @param {number} bottomLvl
   * @param {number} topLvl
   * @returns {{bottom: number, top: number} | null}
   */
  function mergeEnchants(item, itemEnchants, enchant, bottomLvl, topLvl) {
    if (bottomLvl === 0 && !supportsEnchantment(item, itemEnchants, enchant)) return null;
    let maxLvl = enchant.value().getMaxLevel();
    maxLvl = maxLvl <= 1 ? maxLvl : maxLvl + 1;

    if (bottomLvl < maxLvl && bottomLvl === topLvl) return { bottom: bottomLvl + 1, top: 0 };
    return { bottom: Math.max(bottomLvl, topLvl), top: Math.min(bottomLvl, topLvl) };
  }

  /**
   *
   * @param {$ItemStack} item
   * @returns {EnchantmentsMutable}
   */
  function getEnchants(item) {
    return new $ItemEnchantments$Mutable($EnchantmentHelper.getEnchantmentsForCrafting(item));
  }

  /**
   *
   * @param {$ItemStack} item
   * @param {EnchantmentsMutable} enchants
   * @returns {$ItemStack}
   */
  function applyEnchants(item, enchants) {
    if (enchants.keySet().isEmpty()) {
      if (item.id === 'minecraft:enchanted_book') item = Item.of('minecraft:book');
    } else {
      if (item.id === 'minecraft:book') item = Item.of('minecraft:enchanted_book');
    }
    $EnchantmentHelper.setEnchantments(item, enchants.toImmutable());
    return item;
  }

  /**
   *
   * @param {$ItemStack} bottom
   * @param {$ItemStack} top
   * @param {boolean} secondaryClick
   * @return {[$ItemStack, $ItemStack] | null}
   */
  function transferEnchant(bottom, top, secondaryClick) {
    let bottomEnchants = getEnchants(bottom);
    let topEnchants = getEnchants(top);
    let topHasEnchants = !topEnchants.keySet().isEmpty();
    let bottomHasEnchants = !bottomEnchants.keySet().isEmpty();
    let isSplitAction = !topHasEnchants && bottomHasEnchants && top.id === 'minecraft:book' && secondaryClick;
    if (top.id === 'minecraft:enchanted_book' && bottom.id === 'minecraft:book' && !secondaryClick) {
      return null;
    }
    if (!topHasEnchants && !isSplitAction) {
      return null;
    }

    bottom = bottom.copy();
    top = top.copy();
    bottom.setCount(1);
    top.setCount(1);

    if (isSplitAction) {
      for (let holder of bottomEnchants.keySet()) {
        let botLvl = bottomEnchants.getLevel(holder);
        if (botLvl === 1) {
          bottomEnchants.set(holder, 0);
          topEnchants.set(holder, botLvl);
        } else {
          bottomEnchants.set(holder, botLvl - 1);
          topEnchants.set(holder, botLvl - 1);
        }
      }
    } else {
      for (let holder of topEnchants.keySet()) {
        let topLvl = topEnchants.getLevel(holder);
        let botLvl = bottomEnchants.getLevel(holder);
        let merged = mergeEnchants(bottom, bottomEnchants, holder, botLvl, topLvl);
        if (merged === null) continue;
        topEnchants.set(holder, merged.top);
        bottomEnchants.set(holder, merged.bottom);

        if (secondaryClick) break;
      }
    }

    bottom = applyEnchants(bottom, bottomEnchants);
    top = applyEnchants(top, topEnchants);

    return [bottom, top];
  }

  /**
   *
   * @param {StackedEventData} event
   * @returns {boolean}
   */
  function handleEvent(event) {
    if (event.carriedItem.id === 'minecraft:air') return false;
    let res = transferEnchant(event.stackedOnItem, event.carriedItem, event.clickAction.ordinal() === 1);
    if (res === null) return false;
    let bottom = res[0];
    let top = res[1];
    if (event.stackedOnItem.getCount() === 1) {
      event.slot.set(bottom);
    } else {
      event.slot.remove(1);
      event.player.give(bottom);
    }
    if (event.carriedItem.getCount() === 1) {
      if (event.carriedItem.id !== top.id && top.id === 'minecraft:book') {
        event.carriedSlotAccess.set('minecraft:air');
        event.player.give(top);
      } else {
        event.carriedSlotAccess.set(top);
      }
    } else {
      event.carriedItem.setCount(event.carriedItem.getCount() - 1);
      event.player.give(top);
    }

    return true;
  }

  for (const item of API.itemIdsFor([
    /^.+:.+(_axe|_pickaxe|_hoe|_shovel|_sword|_?bow|_helmet|_chestplate|_leggings|_boots)/,
    'minecraft:elytra',
    'minecraft:enchanted_book',
    'minecraft:book',
  ])) {
    recipes.push({
      bottomItem: item,
      action: handleEvent,
    });
  }

  return recipes;
}
