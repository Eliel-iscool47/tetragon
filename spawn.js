const default_mobSpawn = {
	bosses: {
		voidBoss: 10,
		summonerBoss: 10,
		triangleBoss: 10,
		dodgerBoss: 10,
		pentagonBoss: 10,
		hexagonBoss: 10,
		twinBoss: 5, // Twins are rare/difficult
		octagonBoss: 10,
		sniperBoss: 10,
		minefieldBoss: 10,
		ghostBoss: 1000 // New Boss!
	},
	randomBoss(x, y) {
		const choice = weightedRand(this.bosses)
		if (choice === 'twinBoss') {
			this.twinBoss(x + 400, y + 250)
			this.twinBoss(x - 250, y - 400)
		} else {
			this[choice](x, y)
		}
	},
	default(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'default',
			health: 10,
			damage: 8,
			attackRate: 2,
			color: 'hsl(120, 100%, 35%)',
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	bullet(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'bullet',
			class: 'projectile',
			health: 1,
			damage: 5,
			size: 10,
			speed: 5,
			dropChance: 0,
			angle: angle(x, y, state.player.pos.x, state.player.pos.y),
			color: 'hsl(0, 100%, 65%)',
			update: function () { this.moveInAngle() },
			draw: function () {
				this.drawSelf(function () {
					// Apply glow effect
					draw.shadowBlur = 15
					draw.shadowColor = "red"

					// Draw a trailing effect behind the bullet's current position
					for (let i = 1; i <= 3; i++) {
						draw.fillStyle = `hsla(0, 100%, 50%, ${0.5 / i})`
						draw.beginPath()
						draw.arc(i * this.speed * 1.5, 0, (this.size / 2) * (1 - i * 0.2), 0, Math.PI * 2)
						draw.fill()
					}

					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()

					// Reset shadow to prevent bleeding into other draw calls
					draw.shadowBlur = 0
				}.bind(this))
			}
		}))
	},
	tank(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'tank',
			health: 80,
			damage: 20,
			damageTaken: 0.7,
			size: 55,
			speed: 2,
			dropChance: 2,
			attackRate: 0.8,
			color: 'hsl(190, 100%, 45%)',
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeStyle = 'black'
					draw.lineWidth = 2
					draw.strokeRect(this.size * -0.75, this.size * -0.75, this.size * 1.5, this.size * 1.5)
				}.bind(this))
			}
		}))
	},
	archer(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'archer',
			health: 10,
			damage: 5,
			size: 30,
			speed: 5,
			dropChance: 0.8,
			attackRate: 1.5,
			attackType: 'ranged',
			color: 'hsl(300, 100%, 50%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.arrow(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 15) {
					this.moveTowardsPlayer()
				}
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	arrow(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'arrow',
			class: 'projectile',
			health: 1,
			damage: 5,
			size: 8,
			speed: 12,
			dropChance: 0,
			angle: angle(x, y, state.player.pos.x, state.player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 0%, 0%)',
			update: function () { this.moveInAngle() },
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -3, this.size * -0.35, this.size * 6, this.size * 0.7)
					draw.strokeRect(this.size * -3, this.size * -0.35, this.size * 6, this.size * 0.7)
				}.bind(this))
			}
		}))
	},
	grenade(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'grenade',
			class: 'projectile',
			health: 1,
			damage: 5,
			size: 15,
			speed: 5,
			dropChance: 0,
			angle: angle(x, y, state.player.pos.x, state.player.pos.y),
			duration: 1.5,
			color: 'hsl(90, 100%, 30%)',
			update: function () {
				this.moveInAngle()
				if (this.state.simulation.time - this.timeSpawned > this.duration) {
					this.health = 0
					bullets.explosion(this.pos.x, this.pos.y, 2.5, this.damage, true)
				}
			},
			onCollide: function () {
				bullets.explosion(this.pos.x, this.pos.y, 2.5, this.damage, true)
				return false
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
					// Draw a small "fuse" or detail
					draw.fillStyle = 'black'
					draw.fillRect(-2, -this.size / 2 - 2, 4, 4)
				}.bind(this))
			}
		}))
	},
	grenadier(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
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
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.grenade(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 10) {
					this.moveTowardsPlayer()
				}
			},
			draw: function () {
				this.drawSelf(function () {
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
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'summoner boss',
			class: 'boss',
			health: 25,
			damage: 15,
			size: 40,
			speed: 3,
			attackRate: 0.5,
			attackType: 'summon',
			color: 'hsl(0, 0%, 35%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.default(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 8) {
					this.moveTowardsPlayer()
				}
			},
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	/**
	 * The pentagon boss spins and occasionally shoots lasers at its corners
	 * @param {number} x 
	 * @param {number} y 
	 */
	pentagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'pentagon boss',
			class: 'boss',
			health: 30,
			damage: 10,
			size: 50,
			speed: 2,
			attackRate: 0.4,
			telegraphDuration: 0.8,
			color: 'hsl(170, 100%, 70%)',
			update: function () {
				// Spin the boss over time
				this.angle += 0.02

				// Move towards the player
				const moveDir = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				this.pos.x -= Math.cos(moveDir) * this.speed
				this.pos.y -= Math.sin(moveDir) * this.speed

				// Fire lasers from each of the 5 corners occasionally
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					for (let i = 0; i < 5; i++) {
						const cornerAngle = this.angle + (i * Math.PI * 2) / 5
						spawn.pentagonLaser(this.pos.x, this.pos.y, cornerAngle)
					}
					this.timeSinceLastAttack = this.state.simulation.time
				}
			},
			draw: function () {
				this.drawSelf(function () {
					// Warning telegraph lines
					const timeToAttack = (1 / this.attackRate) - (this.state.simulation.time - this.timeSinceLastAttack)
					if (timeToAttack > 0 && timeToAttack < this.telegraphDuration) {
						draw.save()
						// Calculate intensity: fades in and pulses quickly
						const alpha = (1 - timeToAttack / this.telegraphDuration) * (0.3 + 0.5 * Math.sin(this.state.simulation.time * 40))
						draw.strokeStyle = `hsla(0, 100%, 50%, ${alpha})`
						draw.lineWidth = 4

						for (let i = 0; i < 5; i++) {
							draw.save()
							draw.rotate((i * Math.PI * 2) / 5)
							draw.beginPath()
							draw.moveTo(0, 0)
							draw.lineTo(-2000, 0) // Direction matches the laser's firing logic
							draw.stroke()
							draw.restore()
						}
						draw.restore()
					}

					draw.beginPath()
					// Rotate polygon by PI to align vertices with the lasers (-size direction)
					polygon(0, 0, this.size / 2, 5, Math.PI)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
		// Initialize attack timer to current time to ensure the first attack is telegraphed
		const boss = mobs.list[mobs.list.length - 1]
		if (boss && boss.type === 'pentagon boss') {
			boss.timeSinceLastAttack = simulation.time
		}
	},
	pentagonLaser(x, y, angle, target) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'pentagon laser',
			class: 'projectile',
			health: 1,
			damage: 6,
			size: 1,
			length: 2000,
			speed: 0,
			angle: angle,
			attackRate: 5, // Hits every 0.2 seconds
			timeSpawned: state.simulation.time,
			duration: 0.5,
			color: 'hsl(180, 100%, 50%)',
			update: function () {
				if (this.state.simulation.time - this.timeSpawned > this.duration) {
					this.health = 0
					return
				}

				const endX = this.pos.x - Math.cos(this.angle) * this.length
				const endY = this.pos.y - Math.sin(this.angle) * this.length

				// Continuous damage check: check collision every frame, but apply damage on a cooldown
				if (lineCircleCollision(this.pos.x, this.pos.y, endX, endY, this.state.player.pos.x, this.state.player.pos.y, this.state.player.size / 2)) {
					if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
						player.takeDamage(this.damage)
						this.state.upgrades.lastHealthRegen = this.state.simulation.time
						this.timeSinceLastAttack = this.state.simulation.time
					}
				}
			},
			draw: function () {
				this.drawSelf(function () {
					draw.strokeStyle = this.color
					draw.lineWidth = 10
					draw.lineCap = 'round'
					draw.beginPath()
					draw.moveTo(0, 0)
					draw.lineTo(-this.length, 0)
					draw.stroke()

					// Add a bright core to the laser
					draw.strokeStyle = 'white'
					draw.lineWidth = 4
					draw.beginPath()
					draw.moveTo(0, 0)
					draw.lineTo(-this.length, 0)
					draw.stroke()
				}.bind(this))
			},
			// checkCollision: function (other) {
			// 	return lineCircleCollision(this.pos.x, this.pos.y, this.pos.x - Math.cos(this.angle) * this.length, this.pos.y - Math.sin(this.angle) * this.length, other.pos.x, other.pos.y, other.size / 2)
			// }
		}))
	},
	hexagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'hexagon boss',
			class: 'boss',
			health: 40,
			damage: 30,
			size: 65,
			speed: 3,
			attackRate: 2,
			attackType: 'summon',
			color: 'hsl(25, 100%, 45%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					for (let i = 0; i < 3; i++) {
						spawn.hexagonMinion(this.pos.x - Math.cos(this.angle + (i * Math.PI) / 1.5) * this.size, this.pos.y - Math.sin(this.angle + (i * Math.PI) / 1.5) * this.size)
					}
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 4) this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 6)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	hexagonMinion(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'hexagon minion',
			class: 'projectile',
			health: 5,
			damage: 1,
			damageTaken: 5,
			size: 10,
			speed: 7,
			dropChance: 0.3,
			color: 'hsl(30, 100%, 50%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 6)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	octagonBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
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
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					for (let index = 0; index < 8; index++) {
						spawn.octagonBullet(this.pos.x, this.pos.y, (index * Math.PI * 0.25) + this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1))
					}
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 4) this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 8)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	octagonBullet(x, y, angle) {
		mobs.list.push(new mobs.Mob(state, x, y, {
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
			update: function () {
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	triangleBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'triangle boss',
			class: 'boss',
			health: 30,
			damage: 10,
			damageTaken: 1.5,
			size: 60,
			speed: 8,
			attackRate: 5,
			color: 'hsl(0, 100%, 35%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				this.pos.x -= Math.cos(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
				this.pos.y -= Math.sin(this.angle + randInt(Math.PI * -0.1, Math.PI * 0.1)) * this.speed
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 3)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	voidBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'void boss',
			class: 'boss',
			health: 115,
			damage: 10,
			size: 65,
			speed: 0.9,
			attackRate: 0.5,
			color: 'hsl(0, 0%, 10%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) <= this.size * 5) {
					this.state.player.pos.x += Math.cos(this.angle + 0.4) * 1.5
					this.state.player.pos.y += Math.sin(this.angle + 0.4) * 1.5
				}
				this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
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
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'sniper boss',
			class: 'boss',
			health: 40,
			damage: 15,
			size: 40,
			speed: 3,
			attackRate: 0.5,
			attackType: 'ranged',
			color: 'hsl(260, 100%, 30%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.sniperBullet(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size * 10) this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					polygon(0, 0, this.size / 2, 3)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	sniperBullet(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'sniper bullet',
			class: 'projectile',
			health: 1,
			damage: 12,
			size: 12,
			speed: 15,
			dropChance: 0,
			angle: angle(x, y, state.player.pos.x, state.player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 100%, 15%)',
			update: function () { this.moveInAngle() },
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	twinBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'twin boss',
			class: 'boss',
			health: 60,
			damage: 12,
			size: 40,
			speed: 4,
			attackRate: 0.8,
			color: 'hsl(205, 100%, 35%)',
			update: function () {
				this.moveTowardsPlayer()
				mobs.list.forEach(function (other) {
					if (other == this || other.type != "twin boss") return undefined
					if (distance(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < 300) {
						this.heal(0.05)
						draw.beginPath()
						draw.strokeStyle = 'hsl(115, 100%, 50%)'
						draw.lineWidth = 5
						draw.moveTo(this.pos.x, this.pos.y)
						draw.lineTo(other.pos.x, other.pos.y)
						draw.stroke()
					}
				}.bind(this))
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	minefieldBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'minefield boss',
			class: 'boss',
			health: 30,
			damage: 10,
			size: 35,
			speed: 3,
			attackRate: 0.5,
			color: 'hsl(0, 42%, 36%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				if (this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.mine(this.pos.x - Math.cos(this.angle) * this.size, this.pos.y - Math.sin(this.angle) * this.size)
					this.timeSinceLastAttack = this.state.simulation.time
				}
				if (distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y) >= this.size) this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
					draw.fillRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
					draw.strokeRect(this.size * -0.5, this.size * -0.5, this.size, this.size)
				}.bind(this))
			}
		}))
	},
	mine(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'mine',
			class: 'projectile',
			health: 1,
			damage: 20,
			size: 20,
			speed: 0,
			dropChance: 0,
			angle: angle(x, y, state.player.pos.x, state.player.pos.y),
			attackRate: 5,
			color: 'hsl(0, 100%, 25%)',
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	dodgerBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'dodger',
			class: 'boss',
			health: 25,
			damage: 20,
			size: 45,
			speed: 7,
			dropChance: 1,
			color: 'hsl(325, 100%, 50%)',
			anchor: { x, y },
			target: { x, y },
			range: 300,
			update: function () {
				if ((simulation.time - this.timeSpawned) % 5 > 2) {
					if (distance(this.pos.x, this.pos.y, this.target.x, this.target.y) < 10) {
						/* Pick a new random target within the circular range of the anchor point */
						const moveAngle = Math.random() * Math.PI * 2
						const dist = Math.random() * this.range
						this.target.x = clamp(this.anchor.x + Math.cos(moveAngle) * dist, 0, main.width)
						this.target.y = clamp(this.anchor.y + Math.sin(moveAngle) * dist, 0, main.height)
						const me = this
					}
				} else {
					this.target.x = this.state.player.pos.x
					this.target.y = this.state.player.pos.y
				}
				this.angle /*const moveAngle*/ = angle(this.pos.x, this.pos.y, this.target.x, this.target.y)
				this.pos.x -= Math.cos(this.angle) * this.speed
				this.pos.y -= Math.sin(this.angle) * this.speed
			},
			draw: function () {
				this.drawSelf(function () {
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	ghostBoss(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'ghost boss',
			class: 'boss',
			health: 70,
			damage: 15,
			size: 45,
			speed: 2.2,
			color: 'hsla(0, 0%, 100%, 0.6)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				// Periodic invulnerability (phasing)
				const phase = Math.sin(this.state.simulation.time * 2.5)
				this.isInvulnerable = phase > 0.1
				this.moveTowardsPlayer()
			},
			draw: function () {
				this.drawSelf(function () {
					draw.globalAlpha = this.isInvulnerable ? 0.2 : 0.8
					draw.beginPath()
					draw.arc(0, 0, this.size / 2, 0, Math.PI * 2)
					draw.fill()
					draw.stroke()
					// Spectral glow
					draw.shadowBlur = this.isInvulnerable ? 25 : 5
					draw.shadowColor = 'cyan'
				}.bind(this))
			}
		}))
	},
	sentry(x, y) {
		mobs.list.push(new mobs.Mob(state, x, y, {
			type: 'sentry',
			health: 40,
			damage: 5,
			size: 35,
			speed: 0, /* Turrets are stationary */
			attackRate: 3,
			attackType: 'ranged',
			color: 'hsl(230, 100%, 30%)',
			update: function () {
				this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
				const dist = distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)

				// Only fire if the player is within range
				if (dist < 800 && this.state.simulation.time - this.timeSinceLastAttack > 1 / this.attackRate) {
					spawn.bullet(this.pos.x, this.pos.y)
					this.timeSinceLastAttack = this.state.simulation.time
				}
			},
			draw: function () {
				this.drawSelf(function () {
					// Draw the armored square base
					draw.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
					draw.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size)

					// Draw a rotating core to indicate it is active
					draw.fillStyle = 'white'
					draw.beginPath()
					polygon(0, 0, this.size / 3, 4, this.state.simulation.time * 4)
					draw.fill()
					draw.stroke()
				}.bind(this))
			}
		}))
	}
}

var spawn = default_mobSpawn