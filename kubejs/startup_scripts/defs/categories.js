REG.machineGroup({
  id: 'gearbox',
  blocks: [
    'create:gearbox',
    'create:vertical_gearbox',
    'create_connected:parallel_gearbox',
    'create_connected:vertical_parallel_gearbox',
    'create_connected:six_way_gearbox',
    'create_connected:vertical_six_way_gearbox',
  ],
  cost: {
    'create:andesite_casing': 1,
    'create:cogwheel': 2,
  },
});

REG.machineGroup({
  id: 'actuation',
  blocks: [
    'create:clutch',
    'create_connected:inverted_clutch',
    'create:gearshift',
    'create_connected:inverted_gearshift',
    'simulated:directional_gearshift',
    'create_connected:overstress_clutch',
    'create_connected:centrifugal_clutch',
    'create_connected:freewheel_clutch',
    'create_connected:brake',
  ],
  cost: {
    'create:andesite_casing': 1,
    'create:cogwheel': 1,
    'create:shaft': 1,
  },
});

REG.machineGroup({
  id: 'chain_drive',
  blocks: [
    'create:encased_chain_drive',
    'create_connected:encased_chain_cogwheel',
    'create:adjustable_chain_gearshift',
  ],
  cost: {
    'create:andesite_casing': 1,
    'create:shaft': 1,
  },
});
