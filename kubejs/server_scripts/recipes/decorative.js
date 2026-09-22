/**
 * @import { CaptureGroupsFor } from "./regex"
 */

ServerEvents.recipes((event) => {
  /**
   * @template {string[]} T
   * @typedef {object} AssociationArgs
   * @property {T} groups
   * @property {RegExp} regex
   * @property {IngredientInfo} [exclude]
   * @property {Record<RegistryTypes.Item, RegistryTypes.Item>} [overrides]
   * @property {string[]} templates
   * @property {(item: RegistryTypes.Item, templated: RegistryTypes.Item) => void} cb
   */

  /**
   * @template {string[]} T
   * @param {AssociationArgs<T>} args
   */
  function findAssociations({ groups, regex, exclude, templates, overrides, cb }) {
    let rg = regex;
    let items = API.itemIdsFor(rg);

    overrides = overrides ?? {};
    /**
     * @type {Record<RegistryTypes.Item, boolean>}
     */
    let excluded = {};
    for (const item of API.itemIdsFor(exclude ?? [])) {
      excluded[item] = true;
    }
    for (let item of items) {
      if (excluded[item]) continue;
      if (overrides[item]) {
        cb(item, overrides[item]);
        continue;
      }
      // console.log('Looking for associations for ' + item + ' via regex ' + String(rg));
      let capture = rg.exec(item);
      if (!capture) {
        throw new Error("Item id '" + item + "' matched the ingredient regex but then failed to execute on it");
      }
      /**
       * @type {Record<string, string>}
       */
      let mapped = {};
      for (let i = 0; i < groups.length; i++) {
        mapped[groups[i]] = capture[i + 1];
      }

      let tried = '';
      let found = false;
      for (let template of templates) {
        let block = template;
        for (let g of groups) {
          console.log('replacing ' + g + ' template with ' + mapped[g]);
          block = block.replace(new RegExp('\\$' + g + '\\$', 'g'), mapped[g]);
        }
        if (block.indexOf('$') >= 0) {
          throw new Error(
            "Template '" + template + "' didn't compile fully, instead got " + block + '; captures: ' + mapped,
          );
        }
        if (Item.exists(block)) {
          cb(item, /** @type {RegistryTypes.Item} */ (block));
          found = true;
          break;
        }
        tried = tried === '' ? block : tried + '; ' + block;
      }
      if (!found) throw new Error("No template found the match for block '" + item + "'. Tried " + tried);
    }
  }

  findAssociations({
    groups: ['modid', 'block'],
    regex: /^(.+):(.+)_stairs$/,
    exclude: [/^copycats:.+$/, /^'create_connected:copycat_.+$/],
    templates: [
      '$modid$:$block$_block',
      '$modid$:block_of_$block$',
      '$modid$:$block$_planks',
      '$modid$:$block$',
      '$modid$:$block$s',
    ],
    cb: (item, ingredient) => {
      event.remove({ output: item });
      event.shaped(Item.of(item, 4), ['B ', 'BB'], { B: ingredient });
      event.shaped(Item.of(ingredient, 3), ['BB', 'BB'], { B: item });
    },
  });
  findAssociations({
    groups: ['modid', 'block'],
    regex: /^(.+):(.+)_slab$/,
    exclude: [/^copycats:.+$/, /^'create_connected:copycat_.+$/, 'minecraft:petrified_oak_slab'],
    templates: [
      '$modid$:block_of_$block$',
      '$modid$:$block$_block',
      '$modid$:$block$_planks',
      '$modid$:$block$',
      '$modid$:$block$s',
    ],
    overrides: {
      'abyssal_decor:rivited_seabrass_slab': 'abyssal_decor:riveted_seabrass',
    },
    cb: (item, ingredient) => {
      event.remove({ output: item });
      event.remove({ output: ingredient, input: item });
      event.shaped(Item.of(item, 4), ['BB'], { B: ingredient });
      event.shaped(Item.of(ingredient, 1), ['B', 'B'], { B: item });
    },
  });
});
