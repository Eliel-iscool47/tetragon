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
		update(timeScale = 1) {
			const ts = timeScale ?? this.state.simulation.timeScale
			this.pos.x += Math.cos(this.angle) * this.speed * ts
			this.pos.y += Math.sin(this.angle) * this.speed * ts
		}
		takeDamage(amount) {
			this.piercing--
		}
	},
	explosions: {
		size: 25,
		duration: 0.15,
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
			damage: state.guns.shotgun.damage,
			size: 6,
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
			damage: state.guns.smg.damage,
			size: 10,
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
			damage: state.guns.minigun.damage,
			size: 10,
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
	missile(x, y, angleOffset = 0) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'missiles',
			angle: state.input.cursor.angle + angleOffset,
			angleOffset: angleOffset,
			speed: 1.5,
			isHoming: true,
			isExplode: true,
			piercing: 1,
			damage: 5,
			target: {
				x: state.input.cursor.x,
				y: state.input.cursor.y
			},
			steerStrength: 0.15,
			draw: function () {
				this.drawSelf(function () {
					const pulse = 0.5 + 0.5 * Math.sin(this.state.simulation.time * 20)
					// Map speed (1.5 to 30) to hue (200/Blue to 0/Red) for a heat-up effect
					const glowColor = `hsl(${lerp(200, 0, (this.speed - 1.5) / 28.5)}, 100%, 50%)`

					// Add a glow effect to the missile body
					draw.shadowBlur = 10 + pulse * 10
					draw.shadowColor = glowColor

					draw.fillStyle = "hsl(220, 60%, 40%)"
					draw.fillRect(-15, -5, 30, 10)

					// Engine core at the rear
					draw.shadowBlur = 15
					draw.fillStyle = "white"
					draw.beginPath()
					draw.arc(-15, 0, 3 + pulse * 2, 0, Math.PI * 2)
					draw.fill()

					draw.shadowBlur = 0
					draw.fillStyle = glowColor
					draw.setLineDash([3])
					draw.beginPath()
					draw.moveTo(-12.5, 0)
					draw.lineTo(12.5, 0)
					draw.stroke()
					draw.setLineDash([])
				}.bind(this))
			},
			onCollision: function () {
				bullets.explosion(this.pos.x, this.pos.y, 2)
			},
			update: function (timeScale = 1) {
				if (!this.state.simulation) return undefined
				const ts = timeScale ?? this.state.simulation.timeScale
				let nearest = null
				let minDist = 1000 // High search radius for missiles
				this.state.mobs.list.forEach(m => {
					if (m.class != 'projectile' && !m.isInvulnerable) {
						const d = distance(this.pos.x, this.pos.y, m.pos.x, m.pos.y)
						if (d < minDist) {
							minDist = d
							nearest = m
						}
					}
				})

				if (!nearest) nearest = { pos: { x: this.state.input.cursor.x, y: this.state.input.cursor.y } }

				const targetAngle = angle(nearest.pos.x, nearest.pos.y, this.pos.x, this.pos.y)
				let diff = targetAngle - this.angle
				while (diff < -Math.PI) diff += Math.PI * 2
				while (diff > Math.PI) diff -= Math.PI * 2
				this.angle += diff * this.steerStrength * ts // Steer strength for missiles


				this.pos.x += Math.cos(this.angle) * this.speed * ts
				this.pos.y += Math.sin(this.angle) * this.speed * ts
				this.speed = Math.min(30, this.speed + 0.15 * ts)
				this.steerStrength = Math.min(1, this.steerStrength + 0.0006 * ts)

				// Spawn smoke particle for trail effect
				const dt = ts / 60
				if (this.state.simulation.time % 0.05 < dt) {
					this.state.particles.spawn(this.pos.x, this.pos.y, {
						...this.state.particles.missileSmoke,
						angle: this.angle + Math.PI + rand(-0.5, 0.5), // Opposite direction with spread
						speed: rand(0.2, 1.0), // Slight outward speed
						size: rand(3, 6) // Randomize size slightly
					})
				}
			}
		}))
	},
	bouncyBall(x, y) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'bouncyBalls',
			angle: state.input.cursor.angle,
			speed: 8,
			damage: state.guns.bouncyBalls.damage,
			size: 5,
			piercing: guns.bouncyBalls.piercing,
			update(timeScale = 1) {
				const ts = timeScale ?? this.state.simulation.timeScale
				const radius = this.size / 2
				if (this.pos.x < radius || this.pos.x > state.simulation.world.width - radius) {
					this.angle = Math.PI - this.angle + rand(-0.05, 0.05)
					this.pos.x = clamp(this.pos.x, radius, state.simulation.world.width - radius)
					this.speed = Math.min(30, this.speed + 0.8 * ts)
				}
				if (this.pos.y < radius || this.pos.y > state.simulation.world.height - radius) {
					this.angle = -this.angle + rand(-0.05, 0.05)
					this.pos.y = clamp(this.pos.y, radius, state.simulation.world.height - radius)
					this.speed = Math.min(30, this.speed + 0.8 * ts)
				}

				// Homing logic: If upgrade is active, steer toward the nearest mob
				if (upgrades.isBouncyBallHoming) {
					let nearest = null
					let minDistSq = 250000 // 500^2
					
					this.state.collisions.grid.query(this.pos.x, this.pos.y, (m) => {
						if (!m.isMob || m.class === 'projectile' || m.isInvulnerable) return
						const dx = m.pos.x - this.pos.x
						const dy = m.pos.y - this.pos.y
						const dSq = dx * dx + dy * dy
						if (dSq < minDistSq) {
							minDistSq = dSq
							nearest = m
						}
					})
					if (nearest) {
						const targetAngle = angle(nearest.pos.x, nearest.pos.y, this.pos.x, this.pos.y)
						let diff = targetAngle - this.angle
						while (diff < -Math.PI) diff += Math.PI * 2
						while (diff > Math.PI) diff -= Math.PI * 2
						this.angle += diff * 0.08 * ts // Steer strength
					}
				}

				this.pos.x += Math.cos(this.angle) * this.speed * ts
				this.pos.y += Math.sin(this.angle) * this.speed * ts

				// Spawn trail particle every ~30ms
				const dt = ts / 60
				if (this.state.simulation.time % 0.03 < dt) {
					this.state.particles.spawn(this.pos.x, this.pos.y, {
						...this.state.particles.bouncyBallTrail
					})
				}
			},
			draw() {
				this.drawSelf(function () {
					if (upgrades.isBouncyBallHoming) {
						// Add a pulsing golden glow when homing is active
						const pulse = 0.5 + 0.5 * Math.sin(this.state.simulation.time * 15)
						draw.shadowBlur = 12 + pulse * 8
						draw.shadowColor = "hsl(45, 100%, 65%)"
					}
					draw.fillStyle = "hsl(35, 100%, 50%)"
					draw.arc(0, 0, 10, 0, Math.PI * 2)
					draw.fill()
					draw.strokeStyle = 'black'
					draw.stroke()
				})
			}
		}))
	},
	flame(x, y, angle = rand(-state.guns.flamethrower.spread, state.guns.flamethrower.spread) / 100) {
		bullets.list.push(new bullets.Bullet(state, x, y, {
			type: 'flamethrower',
			angle: state.input.cursor.angle + angle,
			speed: 11,
			damage: state.guns.flamethrower.damage,
			size: 15,
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
			type: 'explosion',
			// Initialize to the past so it can damage mobs on the first frame it exists
			timeSinceLastAttack: simulation.time - 1,
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
	move(timeScale = 1) {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach(function (b) { return b.update(timeScale) }.bind(this))
	},
	draw() {
		this.list.forEach(function (b) { return b.draw() }.bind(this))
	},
}