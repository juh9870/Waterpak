export type MachineGroupData = {
  id: string;
  blueprint: string;
  blocks: RegistryTypes.Item[];
  cost: Record<RegistryTypes.Item, number>;
};

export type MachineBlueprint = {
  item: RegistryTypes.Item;
};

export type EventPayload<E> = E extends new (...args: any[]) => infer R ? R : never;

export type RecipeInventoryItemClick = {
  /**
   * Item inside the inventory
   */
  item: RegistryTypes.Item;
  /**
   * Item held in hand
   */
  heldItem?: RegistryTypes.Item;
  /**
   * Action to perform on the item
   */
  itemAction: RecipeInventoryItemClickAction;
  /**
   * Action to perform on the held item. Remains unchanged if not specified
   */
  heldItemAction?: RecipeInventoryItemClickAction;
  /**
   * Which mouse button was responsible for the action
   */
  clickAction?: 'primary' | 'secondary';
};

export type RecipeInventoryItemClickAction = ['transform', ItemStack] | ['damage', number] | ['consume'] | ['keep'];
