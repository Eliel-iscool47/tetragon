const powerUps = {
	list: [],
	gun: {
		name: 'gun',
		color: 'hsl(220, 100%, 35%)',
		new(x, y) {
			powerUps.list.push({
				pos: {
					x: x,
					y: y
				},
				color: this.color,
				effect() {
					powerUps.gun.effect()
					powerUps.list.splice(powerUps.list.indexOf(this), 1)
				},
				type: 'gun',
			})
		},
		effect() {
			guns.random(10)
		}
	},
	heal: {
		name: 'heal',
		color: 'hsl(120, 100%, 40%)',
		new(x, y) {
			powerUps.list.push({
				pos: {
					x: x,
					y: y
				},
				color: this.color,
				effect() {
					powerUps.heal.effect()
					powerUps.list.splice(powerUps.list.indexOf(this), 1)
				},
				type: 'heal',
			})
		},
		effect() {
			player.health += 5
		}
	},
	ammo: {
		name: 'ammo',
		color: 'hsl(230, 100%, 15%)',
		new(x, y) {
			powerUps.list.push({
				pos: {
					x: x,
					y: y
				},
				color: this.color,
				effect() {
					powerUps.ammo.effect()
					powerUps.list.splice(powerUps.list.indexOf(this), 1)
				},
				type: 'ammo',
			})
		},
		effect() {
			guns.inventory.forEach(g => {
				switch (g) {
					case guns.pistol:
						g.magazines += 3
						break
					case guns.missiles:
						g.magazines += 5
						break
					case guns.miniGun:
						g.ammo += 60
						break
					default:
						g.magazines++
						break
				}
			})
		}
	},
	draw() {
		powerUps.list.forEach(p => {
			draw.fillStyle = p.color
			this.draw.strokeStyle = 'black'
			draw.beginPath()
			draw.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2)
			draw.fill()
			draw.beginPath()
			draw.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2)
			draw.stroke()
		})
	},
	logic() {
		powerUps.list.forEach(p => {
			if (utils.distance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) < player.size / 2) {
				p.effect()
			}
		})
	}
}