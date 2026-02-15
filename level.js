const level = {
	intermission: 10,
	time: 0,
	current: 0,
	new() {
		this.time = simulation.time
		document.title = `Tetragon: level ${this.current}`
		switch (true) {
			case this.current <= 1:
				powerUps.gun.new(
					utils.randomInt(collisions.border.left, collisions.border.right),
					utils.randomInt(collisions.border.top, collisions.border.bottom),
				)
				spawn.default(
					utils.randomInt(collisions.border.left, collisions.border.right),
					utils.randomInt(collisions.border.top, collisions.border.bottom),
				)
				break
			case this.current <= 5:
				for (let index = 0;
					index < 5;
					index++
				) {
					spawn.default(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
				}
				break
			case this.current <= 10:
				for (let index = 0; index < 10; index++) {
					spawn.default(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
				}
				spawn.runner(
					utils.randomInt(collisions.border.left, collisions.border.right),
					utils.randomInt(collisions.border.top, collisions.border.bottom),
				)
				spawn.runner(
					utils.randomInt(collisions.border.left, collisions.border.right),
					utils.randomInt(collisions.border.top, collisions.border.bottom),
				)
				break
			case this.current <= 20:
				for (let index = 0; index < 8; index++) {
					spawn.runner(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.tank(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
				}
				break
			default:
				for (let index = 0; index < this.current * 0.3; index++) {
					spawn.default(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.runner(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.tank(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.archer(
						utils.randomInt(collisions.border.left, collisions.border.right),
						utils.randomInt(collisions.border.top, collisions.border.bottom),
					)
				}
				break
		}
		for (let index = 0; index < 3; index++) {
			powerUps.ammo.new(
				utils.randomInt(collisions.border.left, collisions.border.right),
				utils.randomInt(collisions.border.top, collisions.border.bottom),
			)
			powerUps.heal.new(
				utils.randomInt(collisions.border.left, collisions.border.right),
				utils.randomInt(collisions.border.top, collisions.border.bottom),
			)
		}
	},
	next() {
		this.current++
	},
	prev() {
		this.current--
	},
}
