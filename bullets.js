var bullets = {
	laserColor: 'hsla(0, 100%, 60%, 0.85)',
	laserWidth: 4,
	/**
	 * The class responsible for handling bullet graphics and movement.
	 */
	Bullet: class extends Entity {
		constructor(state, x, y, config) {
			super(state, x, y, {
				timeSpawned: state.simulation.time,
				piercing: 0,
				isHoming: false,
				isExplode: false,
				type: '',
				damage: 1,
				...config
			})
		}
		update() {
			this.pos.x += Math.cos(this.angle) * this.speed
			this.pos.y += Math.sin(this.angle) * this.speed
		}
	},
	explosions: {
		size: 25,
		duration: 0.3,
		damageDone: 8,
		color: 'hsl(25, 100%, 50%)',
		damageTaken: 1,
	},
	flames: {
		size: 5,
		duration: 0.6,
		damage: 0.4,
	},
	duration: 1,
	list: [],
	explosionList: [],
	slashList: [],
	firePoolList: [],
	get defaults() {
		return {
			list: [],
			explosionList: [],
			slashList: [],
			firePoolList: [],
			explosions: {
				size: 25,
				duration: 0.3,
				damageDone: 8,
				color: 'hsl(25, 100%, 50%)',
				damageTaken: 1,
			},
			flames: {
				size: 5,
				duration: 0.6,
				damage: 0.4,
			}
		}
	},

	set defaults(val) { throw new Error('bullets.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},

	pistolBullet(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'pistol',
			angle: state.input.cursor.angle,
			speed: 10,
			piercing: 2,
			damage: 2.5,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "black"
					draw.fillRect(-5, -2, 10, 4)
				}.bind(this))
			}
		}))
	},
	sniperBullet(x, y) {
		this.list.push(new bullets.Bullet(state, x, y, {
			type: 'sniper',
			angle: state.input.cursor.angle,
			speed: 30,
			piercing: 4,
			damage: 12,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(0, 100%, 35%)"
					draw.fillRect(-7.5, -2.5, 15, 5)
				}.bind(this))
			}
		}))
	},
	rifleBullet(x, y) {
		this.list.push(new bullets.Bullet(state, x, y, {
			type: 'rifle',
			angle: state.input.cursor.angle,
			speed: 10,
			piercing: 1,
			damage: 1.5,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(0, 100%, 50%)"
					draw.fillRect(-5, -2, 10, 4)
					draw.arc(5, 0, 2, 0, Math.PI * 2)
					draw.fill()
				}.bind(this))
			}
		}))
	},
	shotgunBullet(x, y) {
		this.list.push(new bullets.Bullet(state, x, y, {
			type: 'shotgun',
			angle: state.input.cursor.angle + (rand(-state.guns.shotgun.spread, state.guns.shotgun.spread) / 100),
			speed: 10,
			piercing: 1,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(30, 100%, 50%)"
					draw.arc(0, 0, 3, 0, Math.PI * 2)
					draw.fill()
				}.bind(this))
			}
		}))
	},
	smgBullet(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'smg',
			angle: state.input.cursor.angle,
			speed: 12,
			piercing: 1,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(0, 100%, 50%)"
					draw.arc(0, 0, 5, 0, Math.PI * 2)
					draw.fill()
				}.bind(this))
			}
		}))
	},
	minigunBullet(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'minigun',
			angle: state.input.cursor.angle,
			speed: 10,
			piercing: 1,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(0, 100%, 20%)"
					draw.arc(0, 0, 5, 0, Math.PI * 2)
					draw.fill()
				}.bind(this))
			}
		}))
	},
	grenade(x, y) {
		this.list.push(new bullets.Bullet(state, x, y, {
			type: 'grenadeLauncher',
			angle: Math.atan2(state.input.cursor.y - y, state.input.cursor.x - x),
			speed: 10,
			isExplode: true,
			piercing: 1,
			damage: 10,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(110, 100%, 30%)"
					draw.arc(0, 0, 12, 0, Math.PI * 2)
					draw.fill()
				})
			},
			onCollision: function () {
				bullets.explosion(this.pos.x, this.pos.y, upgrades.grenadeExplosionSize, upgrades.grenadeExplosionDamage)
			}
		}))
	},
	missile(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'missiles',
			angle: state.input.cursor.angle,
			speed: 15,
			isHoming: true,
			isExplode: true,
			piercing: 1,
			damage: 5,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(220, 50%, 25%)"
					draw.fillRect(-15, -5, 30, 10)
				}.bind(this))
			},
			onCollision: function () {
				bullets.explosion(this.pos.x, this.pos.y, 2)
			},
			update: function () {
				this.angle = angle(this.state.input.cursor.x, this.state.input.cursor.y, this.pos.x, this.pos.y)
				this.state.mobs.list.forEach(function (mob) {
					if (
						distance(this.pos.x, this.pos.y, mob.pos.x, mob.pos.y) < mob.size * 8 &&
						mob.class != 'projectile'
					) this.angle = angle(mob.pos.x, mob.pos.y, this.pos.x, this.pos.y)
				}.bind(this))
				this.pos.x += Math.cos(this.angle) * this.speed
				this.pos.y += Math.sin(this.angle) * this.speed
			}
		}))
	},
	bouncyBall(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'bouncyBalls',
			angle: state.input.cursor.angle,
			speed: 8,
			piercing: 3,
			update: function () {
				if (this.pos.x < 0 || this.pos.x > main.width || this.pos.y < 0 || this.pos.y > main.height) {
					this.angle += Math.PI * 0.5 + rand(-0.1, 0.1)
				}
				this.pos.x += Math.cos(this.angle) * this.speed
				this.pos.y += Math.sin(this.angle) * this.speed
			},
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = "hsl(35, 100%, 50%)"
					draw.arc(0, 0, 10, 0, Math.PI * 2)
					draw.fill()
					draw.strokeStyle = 'black'
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	flame(x, y, angle = rand(-state.guns.flamethrower.spread, state.guns.flamethrower.spread) / 100) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'flamethrower',
			angle: state.input.cursor.angle + angle,
			speed: 11,
			piercing: 5,
			draw: function () {
				this.drawSelf(function () {
					draw.fillStyle = `hsl(${rand(0, 40)}, 100%, 50%)`
					draw.arc(0, 0, rand(bullets.flames.size * 0.8, bullets.flames.size * 3), 0, Math.PI * 2)
					draw.fill()
				}.bind(this))
			}
		}))
	},
	laserBeam(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'laser',
			angle: state.input.cursor.angle,
			speed: 0,
			piercing: 1,
			damage: 3,
			draw: function () {
				this.drawSelf(function () {
					draw.lineWidth = bullets.laserWidth
					draw.strokeStyle = bullets.laserColor
					draw.moveTo(0, 0)
					draw.lineTo(Math.max(main.width, main.height) * Math.sqrt(1.5), 0)
					draw.stroke()
				}.bind(this))
			}
		}))
	},
	slash(x, y, angle) {
		this.slashList.push({
			x: x,
			y: y,
			angle: angle,
			time: simulation.time,
			duration: state.upgrades.knifeDuration // Use upgraded duration
		})
	},
	drawSlashes() {
		this.slashList.forEach(s => {
			const elapsed = simulation.time - s.time
			const alpha = clamp(1 - (elapsed / s.duration), 0, 1)

			draw.save()
			draw.translate(s.x, s.y)
			draw.rotate(s.angle)
			draw.beginPath()
			draw.strokeStyle = `rgba(162, 162, 162, ${0.8 * alpha})`
			draw.lineWidth = 8
			draw.lineCap = 'round'
			// Scale the visual arc radius by the upgraded knife range
			draw.arc(0, 0, state.player.size * 1.2 * state.upgrades.knifeRange, -0.8, 0.8)
			draw.stroke()
			draw.restore()
		})
	},
	killSlashes() {
		this.slashList = this.slashList.filter(s => simulation.time - s.time < s.duration)
	},

	spawnFirePool(x, y) {
		this.firePoolList.push({
			pos: { x, y },
			time: simulation.time,
			duration: 2.5,
			size: 45,
			damage: 0.6,
			color: `rgba(${rand(200, 255)}, ${rand(50, 100)}, 0,`
		})
	},
	drawFirePools() {
		this.firePoolList.forEach(p => {
			const elapsed = simulation.time - p.time
			const alpha = clamp(1 - (elapsed / p.duration), 0, 1)
			draw.save()
			draw.beginPath()
			draw.fillStyle = `${p.color} ${0.4 * alpha})`
			draw.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2)
			draw.fill()
			draw.restore()
		})
	},
	killFirePools() {
		this.firePoolList = this.firePoolList.filter(p => simulation.time - p.time < p.duration)
	},

	explosion(posX = state.player.pos.x, posY = state.player.pos.y, size = 1, damage = undefined, targetsPlayerOnly = false) {
		posX ??= state.player.pos.x
		posY ??= state.player.pos.y
		size ??= 1
		this.explosionList.push({
			pos: {
				x: posX,
				y: posY,
			},
			size: size * this.explosions.size,
			damage: damage ?? this.explosions.damageDone,
			time: simulation.time,
			color: upgrades.isExplosionColorful ? `hsl(${rand(0, 360)}, 100%, 50%)` : this.explosions.color,
			timeSinceLastAttack: simulation.time,
			targetsPlayerOnly: targetsPlayerOnly,
		})
	},
	drawExplosions() {
		this.explosionList.forEach(function (xpl) {
			draw.beginPath()
			draw.fillStyle = xpl.color
			draw.arc(xpl.pos.x, xpl.pos.y, xpl.size / 2, 0, Math.PI * 2)
			draw.fill()
		}.bind(this))
	},
	kill() {
		this.list.forEach(function (b) {
			if (
				b.timeSpawned <
				simulation.time - this.duration * guns[b.type].bulletDuration ||
				b.piercing <= 0
			) {
				// Napalm logic: Spawn fire pools if the bullet is a flame and the upgrade is active
				if (b.type === 'flamethrower' && upgrades.isNapalm) {
					this.spawnFirePool(b.pos.x, b.pos.y)
				}

				const isDefaultExplode = b.isExplode || (upgrades.isBulletExplode && upgrades.bulletExplosionTypes.includes(b.type))
				if (isDefaultExplode) {
					let size = 2
					let damage = this.explosions.damageDone
					if (b.type == 'missiles') {
						size *= upgrades.missileExplosionSize
						damage *= upgrades.missileExplosionDamage
					} else if (b.type == 'grenadeLauncher') {
						size *= upgrades.grenadeExplosionSize
						damage *= upgrades.grenadeExplosionDamage
					}
					this.explosion(b.pos.x, b.pos.y, size, damage)
					if (upgrades.clusterBombTypes.includes(b.type) && upgrades.isClusterBomb) {
						repeat(() => {
							this.explosion(
								b.pos.x + rand(-50, 50),
								b.pos.y + rand(-50, 50),
								size * 0.5,
								damage * 0.4
							)
						}, upgrades.clusterBombCount)
					}
				}
				this.list = this.list.filter(function (bullet) { return bullet != b }.bind(this))
			}
		}.bind(this))
	},
	killExplosions() {
		this.explosionList.forEach(function (xpl) {
			if (xpl.time + this.explosions.duration < simulation.time)
				this.explosionList = this.explosionList.filter(x => x !== xpl)
		}.bind(this))
	},
	muzzleFlash() {
		draw.beginPath()
		draw.fillStyle = "hsl(30, 100%, 50%)"
		draw.arc(
			state.player.pos.x + (Math.cos(input.cursor.angle) * state.player.size) / 2,
			state.player.pos.y + (Math.sin(input.cursor.angle) * state.player.size) / 2,
			state.player.size * 0.2,
			0,
			Math.PI * 2,
		)
		draw.fill()
	},
	move() {
		if (simulation.isPaused) return undefined
		this.list.forEach(function (b) { return b.update() }.bind(this))
	},
	draw() {
		this.list.forEach(function (b) { return b.draw() }.bind(this))
	},
}