setworldspawn -3 201 -3
# Mark initialization complete so this only runs once per world
# even though the spawn structure has been removed.
data modify storage water_world structure_spawned set value 1b
