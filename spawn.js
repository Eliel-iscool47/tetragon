const spawn = {
	randomBoss(x, y) {
		switch (randInt(1, 10)) {
			case 1:
				this.voidBoss(x, y)
				break
			case 2:
				this.summonerBoss(x, y)
				break
			case 3:
				this.triangleBoss(x, y)
				break
			case 4:
				this.shifterBoss(x, y)
				break
			case 5:
				this.pentagonBoss(x, y)
				break
			case 6:
				this.hexagonBoss(x, y)
				break
			case 7:
				this.twinBoss(
					x + 400,
					y + 250
				)
				this.twinBoss(
					x - 250,
					y - 400
				)
				break
			case 8:
				this.octagonBoss(x, y)
				break
			case 9:
				this.sniperBoss(x, y)
				break
			case 10:
				this.minefieldBoss(x, y)
				break
			default:
				break
		}
	},
	default(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'default',
			health: 10,
			damage: 8,
			attackRate: 2,
			color: 'hsl(120, 100%, 35%)',
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	runner(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'runner',
			health: 3,
			damage: 4,
			size: 20,
			speed: 8,
			dropChance: 1.2,
			attackRate: 2.5,
			color: 'hsl(0, 100%, 50%)',
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	tank(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'tank',
			health: 80,
			damage: 20,
			damageTaken: 0.7,
			size: 55,
			speed: 2,
			dropChance: 2,
			attackRate: 0.8,
			color: 'hsl(190, 100%, 45%)',
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.75, this.size * -0.75, this.size * 1.5, this.size * 1.5)
				}.bind(this))
			}
		}))
	},
	archer(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'archer',
			health: 10,
			damage: 5,
			size: 30,
			speed: 5,
			dropChance: 0.8,
			attackRate: 1.5,
			attackType: 'ranged',
			color: 'hsl(300, 100%, 50%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.arrow(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 15) {
					this.moveTowardsPlayer()
				}
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	arrow(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'arrow',
			class: 'projectile',
			health: 1,
			damage: 1,
			size: 8,
			speed: 12,
			dropChance: 0,
			angle: angle(x, y, player.pos.x, player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 0%, 0%)',
			update: function() { this.moveInAngle() },
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -3, this.size * -0.35, this.size * 6, this.size * 0.7)
					draw.strokeRect(this.size * -3, this.size * -0.35, this.size * 6, this.size * 0.7)
				}.bind(this))
			}
		}))
	},
	grenadier(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'grenadier',
			health: 100,
			damage: 20,
			damageTaken: 1.2,
			size: 40,
			speed: 2,
			dropChance: 1.1,
			attackRate: 0.6,
			attackType: 'ranged',
			color: 'hsl(90, 100%, 50%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.grenade(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 10) {
					this.moveTowardsPlayer()
				}
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 8, 0)
					draw.fill()
					draw.beginPath()
					polygon(0, 0, this.size / 2, 8, Math.PI / 8)
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	summonerBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'summoner boss',
			class: 'boss',
			health: 25,
			damage: 15,
			size: 40,
			speed: 3,
			attackRate: 0.5,
			attackType: 'summon',
			color: 'hsl(0, 0%, 35%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.default(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 8) {
					this.moveTowardsPlayer()
				}
			},
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	pentagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'pentagon boss',
			class: 'boss',
			health: 30,
			damage: 10,
			size: 50,
			speed: 6,
			attackRate: 0.8,
			attackType: 'summon',
			color: 'hsl(170, 100%, 70%)',
			lastLaserTime: 0,
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 5)
					draw.fill()
					draw.beginPath()
					polygon(0, 0, this.size / 2, 5)
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	hexagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'hexagon boss',
			class: 'boss',
			health: 40,
			damage: 30,
			size: 65,
			speed: 3,
			attackRate: 2,
			attackType: 'summon',
			color: 'hsl(25, 100%, 45%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					for (let i = 0; i < 3; i++) {
						spawn.hexagonMinion(this.pos.x - Math.cos(this.angle + (i * Math.PI) / 1.5) * this.size, this.pos.y - Math.sin(this.angle + (i * Math.PI) / 1.5) * this.size)
					}
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 4) this.moveTowardsPlayer()
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 6)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	hexagonMinion(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'hexagon minion',
			class: 'projectile',
			health: 5,
			damage: 1,
			damageTaken: 5,
			size: 10,
			speed: 7,
			dropChance: 0.3,
			color: 'hsl(30, 100%, 50%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 6)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	octagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'octagon boss',
			class: 'boss',
			health: 90,
			damage: 30,
			damageTaken: 0.8,
			size: 70,
			speed: 3,
			attackRate: 0.8,
			attackType: 'ranged',
			color: 'hsl(150, 100%, 45%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					for (let index = 0; index < 8; index++) {
						spawn.octagonBullet(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size, (index * Math.PI) / 4)
					}
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 4) this.moveTowardsPlayer()
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 8)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	octagonBullet(x, y, angle) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'octagon bullet',
			class: 'projectile',
			health: 5,
			damage: 6,
			damageTaken: 5,
			size: 10,
			speed: 7,
			dropChance: 0.3,
			angle: angle,
			color: 'hsl(30, 100%, 50%)',
			update: function() {
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	triangleBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'triangle boss',
			class: 'boss',
			health: 30,
			damage: 10,
			damageTaken: 1.5,
			size: 60,
			speed: 8,
			attackRate: 5,
			color: 'hsl(0, 100%, 35%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 3)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	voidBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'void boss',
			class: 'boss',
			health: 115,
			damage: 10,
			size: 65,
			speed: 0.9,
			attackRate: 0.5,
			color: 'hsl(0, 0%, 10%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) <= this.size * 5) {
					player.pos.x += Math.cos(this.angle + 0.4) * 1.5
					player.pos.y += Math.sin(this.angle + 0.4) * 1.5
				}
				this.moveTowardsPlayer()
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
					draw.beginPath()
					draw.arc(0, 0, this.size * 2.5, 0, Math.PI * 2)
					draw.fillStyle = "hsla(0, 0%, 0%, 0.65)"
					draw.fill()
				}.bind(this))
			}
		}))
	},
	sniperBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'sniper boss',
			class: 'boss',
			health: 40,
			damage: 15,
			size: 40,
			speed: 3,
			attackRate: 0.5,
			attackType: 'ranged',
			color: 'hsl(260, 100%, 30%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.sniperBullet(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size * 10) this.moveTowardsPlayer()
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 3)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	sniperBullet(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'sniper bullet',
			class: 'projectile',
			health: 1,
			damage: 12,
			size: 12,
			speed: 15,
			dropChance: 0,
			angle: angle(x, y, player.pos.x, player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 100%, 15%)',
			update: function() { this.moveInAngle() },
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.beginPath()
					draw.moveTo(Math.cos(this.angle) * this.size, Math.sin(this.angle) * this.size)
					draw.lineTo(Math.cos(this.angle + Math.PI) * this.size, Math.sin(this.angle + Math.PI) * this.size)
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	twinBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'twin boss',
			class: 'boss',
			health: 60,
			damage: 12,
			size: 40,
			speed: 4,
			attackRate: 0.8,
			color: 'hsl(205, 100%, 35%)',
			update: function() {
				this.moveTowardsPlayer()
				mobs.list.forEach(function(other) {
					if (other == this || other.type != "twin boss") return undefined
					if (distance(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < 300) {
						this.health += 0.05
						draw.beginPath()
						draw.strokeStyle = 'hsl(115, 100%, 50%)'
						draw.lineWidth = 5
						draw.moveTo(this.pos.x, this.pos.y)
						draw.lineTo(other.pos.x, other.pos.y)
						draw.stroke()
					}
				}.bind(this))
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	minefieldBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'minefield boss',
			class: 'boss',
			health: 30,
			damage: 10,
			size: 35,
			speed: 3,
			attackRate: 0.5,
			color: 'hsl(0, 42%, 36%)',
			update: function() {
				this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
				if (simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.mine(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = simulation.time
				}
				if (distance(this.pos.x, this.pos.y, player.pos.x, player.pos.y) >= this.size) this.moveTowardsPlayer()
			},
			draw: function() {
				this.drawSelf(function() {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	mine(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'mine',
			class: 'projectile',
			health: 1,
			damage: 20,
			size: 20,
			speed: 0,
			dropChance: 0,
			angle: angle(x, y, player.pos.x, player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 100%, 25%)',
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	shifterBoss(x, y) {
		mobs.list.push(new mobs.Mob(x, y, {
			type: 'shifter',
			class: 'boss',
			health: 1,
			damage: 20,
			size: 45,
			speed: 8,
			dropChance: 0,
			color: 'hsl(320, 100%, 50%)',
			timeSinceLastShift: (-10) ** 299,
			update: function() {
				if (simulation.time - this.timeSinceLastShift < 1) return undefined
				this.pos.x = randInt(0, main.width)
				this.pos.y = randInt(0, main.height)
				this.timeSinceLastShift = simulation.time
			},
			draw: function() {
				this.drawSelf(function() {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	}
}

/**
Boss Ideas:
10. The Shifter: Teleports around the arena.
*/
