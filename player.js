/**
 * The object containing all the information about the player.
 */
class Player extends Entity {
	constructor(x, y) {
		super(x, y, {
			_health: 100,
			_maxHealth: 100,
			_damageDone: 1,
			_lastDamageTime: -(10 ** 299),
			_damageTaken: 1,
			_isInvulnerable: false,
			_size: 50,
			_velocity: 5,
			color: 'hsl(215, 100%, 45%)',
		})
	}

	takeDamage(amount) {
		if (this.isInvulnerable) return
		this.health -= amount
		this.lastDamageTime = simulation.time
		upgrades.lastHealthRegen = simulation.time
	}

	get health() { return this._health }
	set health(val) { this._health = Math.min(val, this.maxHealth) }

	get maxHealth() { return this._maxHealth }
	set maxHealth(val) {
		this._maxHealth = val
		this.health = Math.min(this.health, val)
	}

	get damageDone() { return this._damageDone }
	set damageDone(val) { this._damageDone = Math.abs(val) }

	get lastDamageTime() { return this._lastDamageTime }
	set lastDamageTime(val) { this._lastDamageTime = Math.abs(val) }

	get damageTaken() { return this._damageTaken }
	set damageTaken(val) { this._damageTaken = val }

	get isInvulnerable() { return this._isInvulnerable }
	set isInvulnerable(val) { this._isInvulnerable = !!val }

	get size() { return this._size }
	set size(val) {
		this._size = Math.max(val, 1)
	}

	get velocity() { return this._velocity }
	set velocity(val) { this._velocity = Math.max(val, 1) }

	setInvulnerable(duration = Number.MAX_VALUE / 1000) {
		duration ??= Number.MAX_VALUE / 1000
		this.isInvulnerable = true
		setTimeout(function () {
			this.isInvulnerable = false
		}.bind(this), duration * 1000)
	}

	deathScreen() {
		draw.fillStyle = 'hsl(0, 100%, 30%)'
		draw.fillRect(0, 0, main.width, main.height)
		draw.fillStyle = 'hsl(0, 0%, 0%)'
		draw.font = `${(main.width + main.height) / 20}px 'DM Sans'`
		draw.textAlign = 'center'
		draw.fillText('Game Over', main.width / 2, main.height / 2)
		draw.font = `${(main.width + main.height) / 40}px 'DM Sans'`
		draw.fillText(`press ${input.keybinds.respawn.replace('Key', '').replace('Digit', '')} to respawn`, main.width / 2, main.height / 2 + 75, main.width)
		document.title = `Tetragon: Score: ${Math.round(level.current)}`
	}

	kill() {
		this.health = 0
		simulation.wipe()
		simulation.isDead = true
		upgrades.pool = [...upgrades.defaultPool]
		upgrades.collected = []
		this.deathScreen()
	}

	draw() {
		this.drawSelf(function () {
			if (simulation.time - this.lastDamageTime < 0.1) draw.fillStyle = 'hsla(0, 100%, 50%, 0.85)'
			else draw.fillStyle = this.color

			if (this.isInvulnerable) {
				draw.save()
				draw.globalAlpha = 0.4 + 0.6 * Math.sin(simulation.time * 30)
				draw.restore()
			}
			draw.fillRect(this.size / -2, this.size / -2, this.size, this.size)

			if (
				input.cursor.angle < Math.PI / -2 ||
				input.cursor.angle > Math.PI / 2
			) draw.drawImage(sprites.commanderHat.left, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)
			else draw.drawImage(sprites.commanderHat.right, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)

			draw.rotate(input.cursor.angle)
			draw.strokeStyle = 'white'
			draw.lineWidth = this.size / 10
			draw.beginPath()
			draw.arc(0, 0, this.size * 0.3, Math.PI * -2, 0)
			draw.stroke()
			draw.beginPath()
			draw.moveTo(Math.cos(angle(0, 0, this.size, 0) * this.size * 0.3), Math.sin(angle(0, 0, this.size, 0)) * this.size * 0.3)
			draw.lineTo(this.size * 0.3, 0)
			draw.stroke()
		}.bind(this))
	}
}

const player = new Player(main.width / 2, main.height / 2)