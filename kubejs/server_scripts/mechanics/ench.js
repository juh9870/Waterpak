ServerEvents.tick((event) => {
  if (event.server.tickCount % 100 === 0)
    while (global.ONCE_EVENTS.length > 0) {
      let evt = global.ONCE_EVENTS.pop();
      if (evt) evt(event.server);
    }
});
