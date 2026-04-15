const level = {
	_intermission: 15,
	get intermission() { return this._intermission },
	set intermission(val) { this._intermission = val },

	_time: 0,
	get time() { return this._time },
	set time(val) { this._time = val },

	_current: 0,
	get current() { return this._current },
	set current(val) { this._current = val },

	new() {
		spawn.randomBoss(
			randInt(collisions.border.left, collisions.border.right),
			randInt(collisions.border.top, collisions.border.bottom),
		)
		this.time = simulation.time
		document.title = `Tetragon: level ${this.current}`
		switch (true) {
			case this.current <= 0:
				repeat(function () {
					spawn.archer(player.pos.x, player.pos.y)
					spawn.tank(player.pos.x, player.pos.y)
					spawn.runner(player.pos.x, player.pos.y)
					spawn.default(player.pos.x, player.pos.y)
				}.bind(this), 100)
			case this.current <= 1:
				powerUps.spawn(
					randInt(collisions.border.left, collisions.border.right),
					randInt(collisions.border.top, collisions.border.bottom),
					powerUps.gun
				)
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 3)
				break
			case this.current <= 5:
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 5)
				break
			case this.current <= 10:
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 8)
				spawn.runner(
					randInt(collisions.border.left, collisions.border.right),
					randInt(collisions.border.top, collisions.border.bottom),
				)
				spawn.runner(
					randInt(collisions.border.left, collisions.border.right),
					randInt(collisions.border.top, collisions.border.bottom),
				)
				break
			case this.current <= 15:
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.runner(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.grenadier(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 8)
				break
			case this.current <= 20:
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.runner(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.tank(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.grenadier(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 8)
				break
			case this.current <= 30:
				repeat(function () {
					spawn.archer(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.tank(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.runner(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.grenadier(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom)
					)
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
				}.bind(this), 12)
			default:
				repeat(function () {
					spawn.default(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.runner(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.tank(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.archer(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom),
					)
					spawn.grenadier(
						randInt(collisions.border.left, collisions.border.right),
						randInt(collisions.border.top, collisions.border.bottom)
					)
				}.bind(this), this.current - 10)
				break
		}
		repeat(function () {
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.ammo
			)
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.heal
			)
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.reroll
			)
		}.bind(this), 2)
	},
	next() {
		this.current++
	},
}
