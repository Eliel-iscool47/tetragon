const powerUps = {
	PowerUp: class extends Entity {
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
			const pulse =  1 + Math.sin(simulation.time * 8)
			// draw.scale(pulse, pulse)
			super.drawSelf(callback)
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
		draw: function() {
			this.drawSelf(function() {
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
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing || player.health >= player.maxHealth) return undefined
			player.health += upgrades.healEffect * 8
			powerUps.list = powerUps.list.filter(function(p) { return p != this; }.bind(this))
		},
		draw: function() {
			this.drawSelf(function() {
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
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			guns.inventory.forEach(function(g) {
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
			powerUps.list = powerUps.list.filter(function(p) { return p != this; }.bind(this))
		},
		draw: function() {
			this.drawSelf(function() {
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
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			upgrades.choose()
			powerUps.list = powerUps.list.filter(function(p) { return p != this; }.bind(this))
		},
		draw: function() {
			this.drawSelf(function() {
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
		new(x, y) {
			powerUps.list.push(new powerUps.PowerUp(x, y, this))
		},
		effect() {
			if (simulation.isPaused || simulation.isChoosing) return undefined
			upgrades.rerolls++
			powerUps.list = powerUps.list.filter(function(p) { return p != this; }.bind(this))
		},
		draw: function() {
			this.drawSelf(function() {
				draw.arc(0, 0, this.size, 0, Math.PI * 2)
				draw.fill()
				draw.stroke()
			}.bind(this))
		}
	},
	draw: function() {
		this.list.forEach(function(p) { return p.draw(); }.bind(this))
	},
	logic: function() {
		powerUps.list.forEach(function(p) {
			if (distance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) < player.size / 2) {
				p.effect()
			}
		}.bind(this))
	}
}