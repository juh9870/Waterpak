REG.tagGroup('kubejs:shaft', {
  items: [
    'create:shaft',
    'create:gantry_shaft',
    'create_connected:shear_pin',
    'create:piston_extension_pole',
    'create_connected:cross_connector',
  ],
  recipesWhitelist: ['create:shaft'],
});

REG.tagGroup('kubejs:belt', {
  items: ['create:belt_connector', 'createtransmission:transmission_chain', 'dndecor:belt_connector'],
  recipesWhitelist: ['create:belt_connector'],
});
