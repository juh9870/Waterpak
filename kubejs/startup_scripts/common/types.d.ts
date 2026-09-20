export type MachineGroupData = {
  id: string;
  blueprint: string;
  blocks: RegistryTypes.Item[];
  cost: Record<RegistryTypes.Item, number>;
};

export type MachineBlueprint = {
  id: string;
  item: RegistryTypes.Item;
};

export type EventPayload<E> = E extends new (...args: any[]) => infer R ? R : never;
