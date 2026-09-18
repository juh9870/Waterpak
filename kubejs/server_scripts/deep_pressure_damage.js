ServerEvents.tick((event) => {
	let players = event.server.getPlayers();
	for (let player of players) {
		let pos = player.position();
		let depth = 191 - pos.y();
		let damageDepth = depth - 16;
		if (player.isUnderWater() && damageDepth > 0) {
			player.damage(1 + damageDepth / 9, 'minecraft:drown');
		}
	}
});
