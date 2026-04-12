const powerUps = {
	PowerUp: class {
		constructor(x, y, config) {
			this.pos = { x, y }
			Object.assign(this, config)
		}
		draw() { }
		/**
		 * A helper to handle standard canvas transformations and styles for power-ups.
		 * @param {Function} callback The drawing logic for the specific power-up shape.
		 */
		drawSelf(callback) {
			draw.save()
			draw.translate(this.pos.x, this.pos.y)
			const pulse = 1 + Math.sin(simulation.time * 8) * 0.15
			draw.scale(pulse, pulse)
			draw.fillStyle = this.color
			draw.strokeStyle = 'black'
			draw.lineWidth = 3
			draw.beginPath()
			callback()
			draw.restore()
		}
	},
	list: [],
	gun: {
		name: 'gun',
		color: 'hsl(120, 70%, 25%)',
		size: 20,
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			guns.choose()
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw() {
			this.drawSelf(() => {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			})
		}
	},
	heal: {
		name: 'heal',
		color: 'hsl(115, 100%, 45%)',
		size: 10,
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing || player.health >= player.maxHealth) return undefined
			player.health += upgrades.healEffect * 8
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw() {
			this.drawSelf(() => {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			})
		}
	},
	ammo: {
		name: 'ammo',
		color: 'hsl(235, 50%, 25%)',
		size: 10,
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			guns.inventory.forEach(g => {
				switch (g) {
					case guns.missiles:
						if (u.percentChance(upgrades.ammoYield - Math.floor(upgrades.ammoYield))) g.magazines += Math.ceil(upgrades.ammoYield) * 3
						else g.magazines += Math.floor(upgrades.ammoYield) * 3
						break
					default:
						if (percentChance(upgrades.ammoYield - Math.floor(upgrades.ammoYield))) g.magazines += Math.ceil(upgrades.ammoYield)
						else g.magazines += Math.floor(upgrades.ammoYield)
						break
				}
			})
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw() {
			this.drawSelf(() => {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			})
		}
	},
	upgrade: {
		name: 'upgrade',
		color: 'hsl(200, 100%, 50%)',
		size: 20,
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			upgrades.choose()
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw() {
			this.drawSelf(() => {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			})
		}
	},
	reroll: {
		name: 'reroll',
		color: 'hsl(280, 100%, 50%)',
		size: 10,
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			upgrades.rerolls++
			powerUps.list = powerUps.list.filter(p => p != this)
		},
		draw() {
			this.drawSelf(() => {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			})
		}
	},
	draw() {
		this.list.forEach(p => p.draw())
	},
	logic() {
		powerUps.list.forEach(p => {
			if (distance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) < player.size / 2) {
				p.effect()
			}
		})
	}
}