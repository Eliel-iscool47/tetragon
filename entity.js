/**
 * Base class for all physical objects in the game world.
 */
class Entity {
	constructor(x, y, config) {
		this.pos = { x, y }
		this.angle = 0
		this.speed = 0
		this.size = 10
		this.color = 'black'
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
		if (this.health !== undefined) this.health -= amount
	}
}
