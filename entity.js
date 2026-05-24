/**
 * Base class for all physical objects in the game world.
 */
class Entity {
	constructor(state, x, y, config) {
		this.state = state
		this.pos = { x, y }
		this.angle = 0
		this.speed = 0
		this.size = 10
		this.color = 'black'
		this.shield = 0
		Object.assign(this, config)
	}

	/**
	 * Handles standard canvas transformations and styles.
	 * @param {Function} callback The specific drawing logic for the subclass.
	 */
	drawSelf(callback) {
		draw.save()
		draw.beginPath()
		draw.translate(this.pos.x, this.pos.y)
		draw.rotate(this.angle)
		draw.fillStyle = this.color
		draw.strokeStyle = 'black'
		draw.lineWidth = 3
		callback()
		draw.restore()
	}

	/**
	 * Standard method to handle damage taken by an entity.
	 * @param {number} amount The amount of damage to apply.
	 */
	takeDamage(amount) {
		if (this.isInvulnerable) return
		let damage = amount * this.damageTaken
		const isCrit = percentChance(this.state.upgrades.critChance)
		if (isCrit) damage *= this.state.upgrades.critMultiplier

		let absorbed = 0
		if (this.shield > 0) {
			absorbed = Math.min(this.shield, damage)
			this.shield -= absorbed
			damage -= absorbed

			this.state.particles.spawn(this.pos.x, this.pos.y, {
				...this.state.particles.textPopup,
				text: Math.round(absorbed),
				color: 'hsl(200, 100%, 60%)',
				size: 20,
				vx: rand(-2, 2),
				vy: rand(-5, -3)
			})
		}

		this.health -= damage
		if (damage > 0) this.state.particles.spawn(this.pos.x, this.pos.y, {
			...this.state.particles.textPopup,
			text: Math.round(damage),
			color: isCrit ? 'yellow' : 'white',
			size: isCrit ? 36 : 24,
			vx: rand(-2, 2),
			vy: rand(-5, -3)
		})
	}

	/**
	 * Standard method to handle healing for an entity.
	 * @param {number} amount The amount of health to restore.
	 */
	heal(amount) {
		this.health += amount
		this.state.particles.spawn(this.pos.x, this.pos.y, {
			...this.state.particles.textPopup,
			text: '+' + Math.round(amount),
			color: 'hsl(120, 100%, 50%)',
			size: 24,
			vx: rand(-2, 2),
			vy: rand(-5, -3)
		})
	}

	checkCollision(other) {
		return distance(this.pos.x, this.pos.y, other.pos.x, other.pos.y) <= (this.size + other.size) * 0.5
	}
}
