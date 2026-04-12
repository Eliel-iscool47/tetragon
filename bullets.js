const bullets = {
	laserColor: 'hsla(0, 100%, 60%, 0.85)',
	laserWidth: 4,
	/**
	 * The class responsible for handling bullet graphics and movement.
	 */
	Bullet: class {
		constructor(x, y, config) {
			this.pos = { x, y }
			this.timeSpawned = simulation.time
			this.angle = 0
			this.speed = 0
			this.piercing = 0
			this.isHoming = false
			this.isExplode = false
			this.type = ''
			this.damage = 1
			Object.assign(this, config)
		}
		update() {
			this.pos.x += Math.cos(this.angle) * this.speed
			this.pos.y += Math.sin(this.angle) * this.speed
		}
		/**
		 * A helper to handle standard canvas transformations for bullets.
		 * @param {Function} callback The drawing logic for the specific bullet shape.
		 */
		drawSelf(callback) {
			draw.save()
			draw.beginPath()
			draw.translate(this.pos.x, this.pos.y)
			draw.rotate(this.angle)
			callback()
			draw.restore()
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
	pistolBullet(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'pistol',
			angle: input.cursor.angle,
			speed: 10,
			piercing: 2,
			damage: 2.5,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "black"
					draw.fillRect(-5, -2, 10, 4)
				})
			}
		}))
	},
	sniperBullet(x, y) {
		this.list.push(new bullets.Bullet(x, y, {
			type: 'sniper',
			angle: input.cursor.angle,
			speed: 30,
			piercing: 4,
			damage: 12,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(0, 100%, 35%)"
					draw.fillRect(-7.5, -2.5, 15, 5)
				})
			}
		}))
	},
	rifleBullet(x, y) {
		this.list.push(new bullets.Bullet(x, y, {
			type: 'rifle',
			angle: input.cursor.angle,
			speed: 10,
			piercing: 1,
			damage: 1.5,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(0, 100%, 50%)"
					draw.fillRect(-5, -2, 10, 4)
					draw.arc(5, 0, 2, 0, Math.PI * 2)
					draw.fill()
				})
			}
		}))
	},
	shotgunBullet(x, y) {
		this.list.push(new bullets.Bullet(x, y, {
			type: 'shotgun',
			angle: input.cursor.angle + (rand(-guns.shotgun.spread, guns.shotgun.spread) / 100),
			speed: 10,
			piercing: 1,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(30, 100%, 50%)"
					draw.arc(0, 0, 3, 0, Math.PI * 2)
					draw.fill()
				})
			}
		}))
	},
	smgBullet(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'smg',
			angle: input.cursor.angle,
			speed: 12,
			piercing: 1,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(0, 100%, 50%)"
					draw.arc(0, 0, 5, 0, Math.PI * 2)
					draw.fill()
				})
			}
		}))
	},
	minigunBullet(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'minigun',
			angle: input.cursor.angle,
			speed: 10,
			piercing: 1,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(0, 100%, 20%)"
					draw.arc(0, 0, 5, 0, Math.PI * 2)
					draw.fill()
				})
			}
		}))
	},
	grenade(x, y) {
		this.list.push(new bullets.Bullet(x, y, {
			type: 'grenadeLauncher',
			angle: Math.atan2(input.cursor.y - y, input.cursor.x - x),
			speed: 10,
			isExplode: true,
			piercing: 1,
			damage: 10,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(110, 100%, 30%)"
					draw.arc(0, 0, 8, 0, Math.PI * 2)
					draw.fill()
				})
			},
		}))
	},
	missile(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'missiles',
			angle: input.cursor.angle,
			speed: 15,
			isHoming: true,
			isExplode: true,
			piercing: 1,
			damage: 5,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(220, 50%, 25%)"
					draw.fillRect(-15, -5, 30, 10)
				})
			},
			onCollision() {
				bullets.explosion(this.pos.x, this.pos.y, 2)
			},
			update() {
				this.angle = angle(input.cursor.x, input.cursor.y, this.pos.x, this.pos.y)
				mobs.list.forEach((mob) => {
					if (
						distance(this.pos.x, this.pos.y, mob.pos.x, mob.pos.y) < mob.size * 8 &&
						mob.class != 'projectile'
					) this.angle = angle(mob.pos.x, mob.pos.y, this.pos.x, this.pos.y)
				})
				this.pos.x += Math.cos(this.angle) * this.speed
				this.pos.y += Math.sin(this.angle) * this.speed
			}
		}))
	},
	bouncyBall(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'bouncyBalls',
			angle: input.cursor.angle,
			speed: 8,
			piercing: 3,
			update() {
				if (this.pos.x < 0 || this.pos.x > main.width || this.pos.y < 0 || this.pos.y > main.height) {
					this.angle += Math.PI * 0.5 + u.rand(-0.1, 0.1)
				}
				this.pos.x += Math.cos(this.angle) * this.speed
				this.pos.y += Math.sin(this.angle) * this.speed
			},
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = "hsl(35, 100%, 50%)"
					draw.arc(0, 0, 10, 0, Math.PI * 2)
					draw.fill()
					draw.strokeStyle = 'black'
					draw.stroke()
				})
			}
		}))
	},
	flame(x, y, angle = u.rand(-guns.flamethrower.spread, guns.flamethrower.spread) / 100) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'flamethrower',
			angle: input.cursor.angle + angle,
			speed: 11,
			piercing: 5,
			draw() {
				this.drawSelf(() => {
					draw.fillStyle = `hsl(${u.rand(0, 40)}, 100%, 50%)`
					draw.arc(0, 0, u.rand(bullets.flames.size * 0.8, bullets.flames.size * 3), 0, Math.PI * 2)
					draw.fill()
				})
			}
		}))
	},
	laserBeam(x, y) {
		bullets.list.push(new bullets.Bullet(x, y, {
			type: 'laser',
			angle: input.cursor.angle,
			speed: 0,
			piercing: 1,
			damage: 3,
			draw() {
				this.drawSelf(() => {
					draw.lineWidth = bullets.laserWidth
					draw.strokeStyle = bullets.laserColor
					draw.moveTo(0, 0)
					draw.lineTo(Math.max(main.width, main.height) * Math.sqrt(1.5), 0)
					draw.stroke()
				})
			}
		}))
	},

	explosion(posX, posY, size) {
		posX ??= player.pos.x
		posY ??= player.pos.y
		size ??= 1
		this.explosionList.push({
			pos: {
				x: posX,
				y: posY,
			},
			size: size * this.explosions.size,
			time: simulation.time,
			color: upgrades.isExplosionColorful ? `hsl(${rand(0, 360)}, 100%, 50%)` : this.explosions.color,
			timeSinceLastAttack: simulation.time,
		})
	},
	drawExplosions() {
		this.explosionList.forEach((xpl) => {
			draw.beginPath()
			draw.fillStyle = xpl.color
			draw.arc(xpl.pos.x, xpl.pos.y, xpl.size / 2, 0, Math.PI * 2)
			draw.fill()
		})
	},
	kill() {
		this.list.forEach((b) => {
			if (
				b.timeSpawned <
				simulation.time - this.duration * guns[b.type].bulletDuration ||
				b.piercing <= 0
			) {
				if (b.isExplode) this.explosion(b.pos.x, b.pos.y, 2)
				if (upgrades.isBulletExplode && upgrades.bulletExplosionTypes.includes(b.type)) this.explosion(b.pos.x, b.pos.y, 2)
				this.list = this.list.filter((bullet) => bullet != b)
			}
		})
	},
	killExplosions() {
		this.explosionList.forEach((xpl) => {
			if (xpl.time + this.explosions.duration < simulation.time)
				this.explosionList.splice(this.explosionList.indexOf(xpl), 1)
		})
	},
	muzzleFlash() {
		draw.beginPath()
		draw.fillStyle = "hsl(30, 100%, 50%)"
		draw.arc(
			player.pos.x + (Math.cos(input.cursor.angle) * player.size) / 2,
			player.pos.y + (Math.sin(input.cursor.angle) * player.size) / 2,
			player.size * 0.2,
			0,
			Math.PI * 2,
		)
		draw.fill()
	},
	move() {
		if (simulation.isPaused) return undefined
		this.list.forEach(b => b.update())
	},
	do() {
		this.list.forEach(b => b.draw())
	},
}
