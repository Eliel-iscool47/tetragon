const mobs = {
	Mob: class {
		/**
		 * 
		 * @param {number} x the x-position of the mob
		 * @param {number} y the y-position o the mob
		 * @param {object} config Properties that vary from mob to mob
		 */
		constructor(x, y, config) {
			this.pos = { x, y }
			this.timeSpawned = simulation.time
			this.angle = 0
			this.timeSinceLastAttack = 0
			this.lastDamageTime = 0
			Object.assign(this, {
				class: 'mob',
				health: 10,
				damage: 5,
				damageTaken: 1,
				size: 25,
				speed: 3,
				dropChance: 1,
				attackRate: 1,
				attackType: 'melee',
				color: 'black',
				...config
			})
			this.maxHealth = config.maxHealth || this.health
		}
		onCollide() {
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
				draw.globalAlpha = lerp(0, 1, (simulation.time - this.timeSpawned) * 2.5)
			}
			draw.translate(this.pos.x, this.pos.y)
			draw.rotate(this.angle)
			draw.fillStyle = this.color
			draw.strokeStyle = "black"
			draw.lineWidth = 3
			callback()
			draw.restore()
		}
		moveTowardsPlayer() {
			this.angle = angle(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
			this.pos.x -= Math.cos(this.angle) * this.speed
			this.pos.y -= Math.sin(this.angle) * this.speed
		}
		moveInAngle() {
			this.pos.x -= Math.cos(this.angle) * this.speed
			this.pos.y -= Math.sin(this.angle) * this.speed
		}
	},
	maxHealth: 1,
	damage: 1,
	list: [],
	drawMobs() {
		this.list.forEach(mob => mob.draw())
	},
	kill() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach((mob) => {
			if (mob.health <= 0) {
				this.list.splice(this.list.indexOf(mob), 1)
				if (upgrades.isKillDefense) upgrades.lastKill = simulation.time
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.3 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.ammo.new(mob.pos.x, mob.pos.y)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.2 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.heal.new(mob.pos.x, mob.pos.y)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.2 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.reroll.new(mob.pos.x, mob.pos.y)
				if (
					percentChance(upgrades.powerUpSpawnChance * 0.1 * mob.dropChance) &&
					mob.class != "projectile"
				) powerUps.gun.new(mob.pos.x, mob.pos.y)
				if (
					percentChance(
						upgrades.powerUpSpawnChance * 0.08 * mob.dropChance,
					) ||
					mob.class == "boss"
				) powerUps.upgrade.new(mob.pos.x, mob.pos.y)
			}
			if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
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
		})
	},
	loop() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		this.list.forEach((mob) => {
			if (mob.health > mob.maxHealth) mob.health = mob.maxHealth
			mob.update()
		})
	},
}
