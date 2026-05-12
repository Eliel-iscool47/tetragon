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
				class: 'mob',
				health: 10,
				damage: 5,
				damageTaken: 1,
				size: 25,
				speed: 3,
				isInvulnerable: false,
				dropChance: 1,
				attackRate: 1,
				attackType: 'melee',
				color: 'black',
				...config
			})
			this.timeSpawned = this.state.simulation.time
			this.timeSinceLastAttack = 0
			this.lastDamageTime = 0
			this.maxHealth = config.maxHealth || this.health
		}
		onCollide() { }

		/**
		 * Reduces mob health, accounting for invulnerability and damage multipliers.
		 * @param {number} amount Raw damage amount.
		 */
		takeDamage(amount) {
			if (this.isInvulnerable) return
			const damage = amount * this.damageTaken
			this.health -= damage
			this.lastDamageTime = this.state.simulation.time
			if (this.state.upgrades.isVampire) {
				this.state.player.health += damage * this.state.upgrades.vampireHealAmmount
				this.state.particles.spawn(state, this.pos.x, this.pos.y, this.state.particles.vampire)//simulation.spawnVampireParticle(this.pos.x, this.pos.y)
			}
		}

		update() {
			this.moveTowardsPlayer()
		}
		draw() { }
		/**
		 * A helper to handle standard canvas transformations and styles.
		 * @param {Function} callback The drawing logic for the specific mob shape.
		 */
		drawSelf(callback) {
			draw.save()
			if (this.class !== 'projectile') {
				draw.globalAlpha = lerp(0, 1, (this.state.simulation.time - this.timeSpawned) * 2.5)
			}
			super.drawSelf(callback)
			draw.restore()
		}
		moveTowardsPlayer() {
			this.angle = angle(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
			this.pos.x -= Math.cos(this.angle) * this.speed
			this.pos.y -= Math.sin(this.angle) * this.speed
		}
		moveInAngle() {
			this.pos.x -= Math.cos(this.angle) * this.speed
			this.pos.y -= Math.sin(this.angle) * this.speed
		}
	},
	list: [],
	get defaults() {
		return { list: [] }
	},

	set defaults(val) { throw new Error('mobs.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	drawMobs: function () {
		this.list.forEach(function (mob) { return mob.draw() }.bind(this))
	},
	kill: function () {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach(function (mob) {
			if (mob.health <= 0) {
				this.list = this.list.filter(m => m !== mob)
				if (upgrades.isKillDefense) upgrades.lastKill = simulation.time
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.3 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.spawn(mob.pos.x, mob.pos.y, powerUps.ammo)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.2 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.spawn(mob.pos.x, mob.pos.y, powerUps.heal)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.2 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.spawn(mob.pos.x, mob.pos.y, powerUps.reroll)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.1 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.spawn(mob.pos.x, mob.pos.y, powerUps.gun)
				if (
					percentChance(
						upgrades.powerUpSpawnChance * 0.08 * mob.dropChance,
					) ||
					mob.class == "boss"
				) powerUps.spawn(mob.pos.x, mob.pos.y, powerUps.upgrade)
			}
			if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
		}.bind(this))
	},
	healthBars: function () {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach(function (mob) {
			draw.save()
			if (mob.class != "projectile") {
				draw.globalAlpha = clamp(
					(simulation.time - mob.timeSpawned) * 2.5,
					0.2,
					1,
				)
			} else draw.globalAlpha = 1
			draw.translate(mob.pos.x, mob.pos.y)
			switch (true) {
				case mob.class == "mob" ||
					mob.class == "shooter" ||
					mob.class == "boss":
					draw.strokeStyle = "hsl(0, 0%, 0%)"
					draw.lineWidth = 1
					draw.strokeRect(mob.size * -0.5, -mob.size, mob.size, mob.size * 0.2)
					draw.fillStyle = "hsl(0, 100%, 50%)"
					draw.fillRect(
						mob.size * -0.5,
						-mob.size,
						(mob.size * mob.health) / mob.maxHealth,
						mob.size * 0.2,
					)
					break
				case mob.class == "projectile":
					break
				default:
					throw new Error(
						`Fatass, you forgot to add the health bar for ${mob.class}`,
					)
			}
			draw.restore()
		}.bind(this))
	},
	loop: function () {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach(function (mob) {
			if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
			mob.update()
		}.bind(this))
	},
}