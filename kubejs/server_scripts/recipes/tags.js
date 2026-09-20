ServerEvents.tags('item', (event) => {
  for (const tag in global.TAG_GROUPINGS) {
    let g = global.TAG_GROUPINGS[tag];
    for (const item of g.items) {
      event.add(/** @type {RegistryTypes.ItemTag} */ (tag), item);
      if (!g.noSelector && g.items.length > 1) {
        event.add('l2itemselector:selectable', item);
      }
    }
  }
  for (const flip of global.ITEM_FLIPS) {
    event.add('l2itemselector:selectable', flip.b);
    event.add('l2itemselector:selectable', flip.a);
  }
});

ServerEvents.recipes((event) => {
  /**
   *
   * @param {RegistryTypes.ItemTag} tag
   * @param {RegistryTypes.Item[]} items
   */
  function tagGrouping(tag, items) {
    if (items.length > 2) {
      for (const item of items) {
        event.stonecutting(Item.of(item), Ingredient.of(/** @type {`#${RegistryTypes.ItemTag}`} */ ('#' + tag)));
      }
    } else if (items.length === 2) {
      event.stonecutting(Item.of(items[0]), Ingredient.of(items[1]));
      event.stonecutting(Item.of(items[1]), Ingredient.of(items[0]));
    }
  }

  for (const tag in global.TAG_GROUPINGS) {
    let group = global.TAG_GROUPINGS[tag];

    /**
     * @type {RegistryTypes.Item[]}
     */
    let items = [];
    for (const item of Ingredient.of(/** @type {RegistryTypes.ItemTag} */ ('#' + tag)).itemIds.toArray()) {
      items.push(/** @type {RegistryTypes.Item}*/ (String(item)));
    }

    for (const item of items) {
      if (group.recipesWhitelist.indexOf(item) < 0) {
        event.remove({ output: item });
      }
    }

    tagGrouping(/** @type {RegistryTypes.ItemTag} */ (tag), items);
  }

  // flips
  for (const flip of global.ITEM_FLIPS) {
    if (!flip.noMoreClutter) {
      event.stonecutting(Item.of(flip.a), [Ingredient.of(flip.b)]);
      event.stonecutting(Item.of(flip.b), [Ingredient.of(flip.a)]);
    }
    event.recipes.create
      .item_application([CreateItem.of(flip.a)], [Ingredient.of(flip.b), Ingredient.of('#minecraft:pickaxes')])
      .keepHeldItem();
    event.recipes.create
      .item_application([CreateItem.of(flip.b)], [Ingredient.of(flip.a), Ingredient.of('#minecraft:pickaxes')])
      .keepHeldItem();
  }
});

ServerEvents.generateData('after_mods', (event) => {
  /**
   * @type {Record<string, string[]>}
   */
  const entries = {};

  const tagGroupTags = [];

  for (const tag in global.TAG_GROUPINGS) {
    let g = global.TAG_GROUPINGS[tag];
    if (!g.noSelector && g.items.length > 1) {
      entries[tag] = g.items;
    }
    if (!g.noSelector) {
      tagGroupTags.push(tag);
    }
  }

  JsonIO.write('config/tag_stacker_tags.json', tagGroupTags);

  for (let i = 0; i < global.ITEM_FLIPS.length; i++) {
    let flip = global.ITEM_FLIPS[i];
    entries['kubejs:flip_' + i] = [flip.a, flip.b];
  }

  event.json(
    'kubejs:l2itemselector_config/item_selector/modpack',
    /** @type {any} */ ({
      map: entries,
    }),
  );

  event.json(
    'kubejs:shape_map/modpack_cluttercompat_remove',
    /** @type {any} */ ({
      priority: 502,
      remove: {
        'create:gearbox': ['create:gearbox', 'create:vertical_gearbox'],
      },
    }),
  );
});
