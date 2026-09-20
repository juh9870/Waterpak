StartupEvents.registry("item", (event) => {
	for (const bp of global.BLUEPRINTS) {
		event.create("kubejs:blueprint_" + bp.id).texture("kubejs:item/blueprint");
	}
});
