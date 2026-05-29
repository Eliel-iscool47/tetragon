var mobs = {
	Mob: class extends Entity {
		/**
		 *
		 * @param {number} x the x-position of the mob
		 * @param {number} y the y-position of the mob
		 * @param {object} config Properties that vary from mob to mob
		 */
		constructor(state, x, y, config) {
			super(state, x, y, {
				class: "mob",
				health: 10,
				damage: 5,
				damageTaken: 1,
				size: 25,
				speed: 3,
				isInvulnerable: false,
				dropChance: 1,
				attackRate: 1,
				attackType: "melee",
				color: "black",
				...config
			})
			this.timeSpawned = this.state.simulation.time
			this.timeSinceLastAttack = this.state.simulation.time
			this.lastDamageTime = 0
			this.maxHealth = config.maxHealth || this.health

			// Apply Hardcore Difficulty Scaling
			if (this.state.simulation.gamemode === 'hardcore') {
				this.speed *= 1.35
				this.damage *= 2
			}
		}
		/**
		 * Logic executed when this mob collides with the player.
		 * @returns {boolean} Whether the mob should remain in the game list.
		 */
		onCollide() {
			// Prevent frame-rate dependent damage by checking against attackRate
			if (this.state.simulation.time - this.timeSinceLastAttack < 1 / this.attackRate) return true

			this.state.player.takeDamage(this.damage, this)
			this.state.upgrades.lastHealthRegen = this.state.simulation.time
			this.state.simulation.shake = 5
			this.timeSinceLastAttack = this.state.simulation.time
			if (this.class != "projectile") {
				const angle = input.cursor.angle + rand(-Math.PI / 12, Math.PI / 12)
				this.pos.x += Math.cos(angle) * this.speed * this.size * 0.5
				this.pos.y += Math.sin(angle) * this.speed * this.size * 0.5
				return true
			}
			return false
		}

		/**
		 * Reduces mob health, accounting for invulnerability and damage multipliers.
		 * @param {number} amount Raw damage amount.
		 */
		takeDamage(amount) {
			if (this.isInvulnerable) return
			let damage = amount * this.damageTaken
			const isCrit = percentChance(this.state.upgrades.critChance)
			if (isCrit) damage *= this.state.upgrades.critMultiplier

			this.health -= damage
			if (damage > 0) this.state.particles.spawn(this.pos.x, this.pos.y, {
				...this.state.particles.textPopup,
				text: Math.round(damage),
				color: isCrit ? 'yellow' : 'hsl(30, 100%, 60%)',
				size: isCrit ? 36 : 24,
				vx: rand(-2, 2),
				vy: rand(-5, -3)
			})

			this.lastDamageTime = this.state.simulation.time
			if (this.state.upgrades.isVampire) {
				this.state.particles.spawn(
					this.pos.x,
					this.pos.y,
					{ ...this.state.particles.vampire,
						healAmount: damage * this.state.upgrades.vampireHealAmmount
					}
				)
			}
		}

		/**
		 * Handles everything that happens when a mob dies.
		 */
		die() {
			const { upgrades, powerUps, simulation } = this.state

			if (upgrades.isKillDefense) upgrades.lastKill = simulation.time

			if (this.class !== "projectile") {
				const chance = upgrades.powerUpSpawnChance * this.dropChance

				if (percentChance(chance * 0.2))
					powerUps.spawn(this.pos.x, this.pos.y, powerUps.ammo)
				if (percentChance(chance * 0.15))
					powerUps.spawn(this.pos.x, this.pos.y, powerUps.heal)
				if (percentChance(chance * 0.1))
					powerUps.spawn(this.pos.x, this.pos.y, powerUps.reroll)
				if (percentChance(chance * 0.05))
					powerUps.spawn(this.pos.x, this.pos.y, powerUps.gun)

				if (percentChance(chance * 0.02) || this.class === "boss") {
					powerUps.spawn(this.pos.x, this.pos.y, powerUps.upgrade)
				}
			}

			// Trigger a small screen shake on mob death
			if (this.class === "boss") simulation.shake = 10
		}

		update(timeScale = 1) {
			const ts = timeScale ?? this.state.simulation.timeScale
			this.moveTowardsPlayer(ts)
		}
		draw() {}
		/**
		 * A helper to handle standard canvas transformations and styles.
		 * @param {Function} callback The drawing logic for the specific mob shape.
		 */
		drawSelf(callback) {
			draw.save()
			if (this.class !== "projectile") {
				draw.globalAlpha = lerp(
					0,
					1,
					(this.state.simulation.time - this.timeSpawned) * 2.5
				)
			}
			super.drawSelf(callback)
			draw.restore()
		}

		/**
		 * Calculates a repulsion vector to keep mobs from overlapping.
		 */
		getSeparationForce() {
			let forceX = 0
			let forceY = 0
			let count = 0
			const desiredSeparation = this.size * 1.2
			const desiredSepSq = desiredSeparation * desiredSeparation

			// Optimization: Use the grid to find neighbors instead of checking every mob in the game
			this.state.collisions.grid.query(this.pos.x, this.pos.y, (other) => {
				if (!other.isMob || other === this || other.class === "projectile") return
				const dx = this.pos.x - other.pos.x
				const dy = this.pos.y - other.pos.y
				const dSq = dx * dx + dy * dy
				
				if (dSq > 0 && dSq < desiredSepSq) {
					const d = Math.sqrt(dSq)
					forceX += dx / d
					forceY += dy / d
					count++
				}
			})

			if (count > 0) {
				forceX /= count
				forceY /= count
			}
			return { x: forceX, y: forceY }
		}

		moveTowardsPlayer(timeScale = 1) {
			const ts = timeScale ?? this.state.simulation.timeScale
			this.angle = angle(
				this.pos.x,
				this.pos.y,
				this.state.player.pos.x,
				this.state.player.pos.y
			)

			let vx = -Math.cos(this.angle)
			let vy = -Math.sin(this.angle)

			if (this.class !== "projectile") {
				const sep = this.getSeparationForce()
				vx += sep.x * 1.5 // Multiplier for separation strength
				vy += sep.y * 1.5
			}

			const mag = Math.sqrt(vx * vx + vy * vy)
			if (mag > 0) {
				this.pos.x += (vx / mag) * this.speed * ts
				this.pos.y += (vy / mag) * this.speed * ts
			}
		}

		moveInAngle(timeScale = 1) {
			const ts = timeScale ?? this.state.simulation.timeScale
			this.pos.x -= Math.cos(this.angle) * this.speed * ts
			this.pos.y -= Math.sin(this.angle) * this.speed * ts
		}
	},
	list: [],
	get defaults() {
		return { list: [] }
	},

	set defaults(val) {
		throw new Error("mobs.defaults is read-only")
	},

	reset() {
		Object.assign(this, this.defaults)
	},
	drawMobs() {
		this.list.forEach((mob) => mob.draw())
	},
	kill() {
		if (simulation.isPaused || simulation.isChoosing) return undefined

		// Filter out dead mobs and trigger their death logic
		this.list = this.list.filter(mob => {
			if (mob.health <= 0) {
				mob.die()
				return false
			}
			if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
			return true
		})
	},
	healthBars() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach((mob) => {
				draw.save()
				if (mob.class != "projectile") {
					draw.globalAlpha = clamp(
						(simulation.time - mob.timeSpawned) * 2.5,
						0.2,
						1
					)
				} else draw.globalAlpha = 1
				draw.translate(mob.pos.x, mob.pos.y)
				switch (true) {
					case mob.class == "mob" ||
						mob.class == "shooter" ||
						mob.class == "boss":
						draw.strokeStyle = "hsl(0, 0%, 0%)"
						draw.lineWidth = 1
						draw.strokeRect(
							mob.size * -0.5,
							-mob.size,
							mob.size,
							mob.size * 0.2
						)
						draw.fillStyle = "hsl(0, 100%, 50%)"
						draw.fillRect(
							mob.size * -0.5,
							-mob.size,
							(mob.size * mob.health) / mob.maxHealth,
							mob.size * 0.2
						)
						break
					case mob.class == "projectile":
						break
					default:
						throw new Error(
							`Fatass, you forgot to add the health bar for ${mob.class}`
						)
				}
				draw.restore()
			})
	},
	loop(timeScale = 1) {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach((mob) => {
				if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
				mob.update(timeScale)
			})
	}
}
