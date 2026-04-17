const powerUps = {
	PowerUp: class extends Entity {
		static spawn(x, y, config) {
			powerUps.list.push(new this(x, y, config))
		}
		constructor(x, y, config) {
			super(x, y, config)
		}
		draw() { }
		/**
		 * A helper to handle standard canvas transformations and styles for power-ups.
		 * @param {Function} callback The drawing logic for the specific power-up shape.
		 */
		drawSelf(callback) {
			draw.save()
			const pulse = 1 + Math.sin(simulation.time * 8) * 0.2
			super.drawSelf(function () {
				draw.scale(pulse, pulse)
				callback()
			})
			draw.restore()
		}
	},
	spawn(x, y, type) {
		let spawnX = x
		let spawnY = y
		const minGap = 35

		// If the spawn location is crowded, nudge the position away from existing power-ups
		for (let i = 0; i < 6; i++) {
			const nearest = this.list.find(p => distance(spawnX, spawnY, p.pos.x, p.pos.y) < minGap)
			if (!nearest) break

			const dir = angle(spawnX, spawnY, nearest.pos.x, nearest.pos.y)
			spawnX += Math.cos(dir) * minGap
			spawnY += Math.sin(dir) * minGap
		}
		this.PowerUp.spawn(spawnX, spawnY, type)
	},
	list: [],
	gun: {
		name: 'gun',
		color: 'hsl(120, 70%, 25%)',
		size: 20,
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			guns.choose()
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw: function () {
			this.drawSelf(function () {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	heal: {
		name: 'heal',
		color: 'hsl(115, 100%, 45%)',
		size: 10,
		effect() {
			if (simulation.isPaused || simulation.isChoosing || player.health >= player.maxHealth) return undefined
			player.health += upgrades.healEffect * 8
			powerUps.list = powerUps.list.filter(function (p) { return p != this }.bind(this))
		},
		draw: function () {
			this.drawSelf(function () {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	ammo: {
		name: 'ammo',
		color: 'hsl(235, 50%, 25%)',
		size: 10,
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			guns.inventory.forEach(function (g) {
				switch (g) {
					case guns.missiles:
						if (percentChance(upgrades.ammoYield - Math.floor(upgrades.ammoYield))) g.magazines += Math.ceil(upgrades.ammoYield) * 3
						else g.magazines += Math.floor(upgrades.ammoYield) * 3
						break
					default:
						if (percentChance(upgrades.ammoYield - Math.floor(upgrades.ammoYield))) g.magazines += Math.ceil(upgrades.ammoYield)
						else g.magazines += Math.floor(upgrades.ammoYield)
						break
				}
			}.bind(this))
			powerUps.list = powerUps.list.filter(function (p) { return p != this }.bind(this))
		},
		draw: function () {
			this.drawSelf(function () {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	upgrade: {
		name: 'upgrade',
		color: 'hsl(200, 100%, 50%)',
		size: 20,
		effect() {
			if (
				simulation.isPaused ||
				simulation.isChoosing
			) return undefined
			upgrades.choose()
			powerUps.list = powerUps.list.filter(function (p) { return p != this }.bind(this))
		},
		draw: function () {
			this.drawSelf(function () {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	reroll: {
		name: 'reroll',
		color: 'hsl(280, 100%, 50%)',
		size: 10,
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			upgrades.rerolls++
			powerUps.list = powerUps.list.filter(function (p) { return p != this }.bind(this))
		},
		draw: function () {
			this.drawSelf(function () {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	draw: function () {
		this.list.forEach(function (p) { return p.draw() }.bind(this))
	},
	logic: function () {
		powerUps.list.forEach(function (p) {
			if (p.checkCollision(player)) p.effect()
			const dist = distance(p.pos.x, p.pos.y, player.pos.x, player.pos.y)
			if (dist < upgrades.magnetRange && !simulation.isChoosing && !simulation.isPaused) { // Range where the magnet starts pulling
				const dir = angle(p.pos.x, p.pos.y, player.pos.x, player.pos.y)
				const magnetSpeed = distance(p.pos.x, p.pos.y, player.pos.x, player.pos.y) / 20 // Speed at which the magnet pulls
				p.pos.x -= Math.cos(dir) * magnetSpeed * upgrades.magnetStrength
				p.pos.y -= Math.sin(dir) * magnetSpeed * upgrades.magnetStrength

				// Draw a tapering visual trail effect
				for (let i = 0; i < 3; i++) {
					draw.beginPath()
					draw.strokeStyle = `hsla(0, 100%, 50%, ${0.5 - i * 0.15})`
					draw.lineWidth = 4 - i
					draw.moveTo(p.pos.x, p.pos.y)
					draw.lineTo(p.pos.x + Math.cos(dir) * (10 + i * 15), p.pos.y + Math.sin(dir) * (10 + i * 15))
					draw.stroke()
				}
			}
		}.bind(this))
	}
}
