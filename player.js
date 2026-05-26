/**
 * The object containing all the information about the player.
 */
class Player extends Entity {
	constructor(state, x, y) {
		super(state, x, y, {
			_health: 100,
			_maxHealth: 100,
			_damageDone: 1,
			_lastDamageTime: -(10 ** 299),
			_damageTaken: 1,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
			_speedBoostUntil: 0,
			_size: 50,
			_velocity: 5,
			color: 'hsl(215, 100%, 45%)',
		})
	}

	get defaults() {
		return {
			_health: 100,
			_maxHealth: 100,
			_damageDone: 1,
			_lastDamageTime: -(10 ** 299),
			_damageTaken: 1,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
			_speedBoostUntil: 0,
			_size: 50,
			_velocity: 5,
			color: 'hsl(215, 100%, 45%)',
			pos: { x: main.width / 2, y: main.height / 2 }
		}
	}

	set defaults(val) { throw new Error('player.defaults is read-only') }

	takeDamage(amount) {
		if (this.isInvulnerable) return
		let damage = amount * this.damageTaken

		this.health -= damage
		if (damage > 0) this.state.particles.spawn(this.pos.x, this.pos.y, {
			...this.state.particles.textPopup,
			text: Math.round(damage),
			color: 'hsl(0, 100%, 60%)',
			size: 24,
			vx: rand(-2, 2),
			vy: rand(-5, -3)
		})

		this.lastDamageTime = this.state.simulation.time
		this.state.upgrades.lastHealthRegen = this.state.simulation.time
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
	set lastDamageTime(val) { this._lastDamageTime = val }

	get damageTaken() { return this._damageTaken }
	set damageTaken(val) { this._damageTaken = val }

	get isInvulnerable() { return this._isInvulnerable || this.state.simulation.time < this._invulnerableUntil }
	set isInvulnerable(val) { this._isInvulnerable = !!val }

	get size() { return this._size }
	set size(val) {
		this._size = val
	}

	get velocity() { 
		return this.state.simulation.time < this._speedBoostUntil ? this._velocity * 1.6 : this._velocity 
	}
	set velocity(val) { this._velocity = Math.max(val, 1) }

	setInvulnerable(duration) {
		this._invulnerableUntil = Math.max(this.state.simulation.time, this._invulnerableUntil) + duration
	}

	setSpeedBoost(duration) {
		this._speedBoostUntil = this.state.simulation.time + duration
	}

	deathScreen() {
		draw.fillStyle = 'hsl(0, 100%, 30%)'
		draw.fillRect(0, 0, 1500, 800) // Fill virtual world
		draw.fillStyle = 'hsl(0, 0%, 0%)'
		draw.font = `115px 'DM Sans'`
		draw.textAlign = 'center'
		draw.fillText('Game Over', 750, 400)
		
		// Draw the leaderboard submission status
		draw.fillStyle = 'rgba(255, 255, 255, 0.7)'
		draw.font = `28px 'DM Sans'`
		draw.fillText(this.state.simulation.scoreStatus, 750, 530)

		draw.fillStyle = 'hsl(0, 0%, 0%)'
		draw.font = `57px 'DM Sans'`
		draw.fillText(`press ${this.state.input.keybinds.respawn.replace('Key', '').replace('Digit', '')} to respawn`, 750, 475)
		draw.font = `30px 'DM Sans'`
		draw.fillText(`or ${this.state.input.keybinds.mainMenu.replace('Key', '').replace('Digit', '')} to go back to the main menu`, 750, 510)
		document.title = `Tetragon: Score: ${Math.round(this.state.level.current)}`
	}

	kill() {
		this.health = 0
		const score = Math.round(this.state.level.current)
		const highScore = Number(localStorage.getItem('tetragon-high-score') || 0)
		if (score > highScore) {
			this.state.simulation.scoreStatus = "New High Score!"
			localStorage.setItem('tetragon-high-score', score)
			if (window.submitHighScore) window.submitHighScore(score)
		} else {
			this.state.simulation.scoreStatus = ""
		}

		this.state.simulation.wipe()
		this.state.simulation.isDead = true
		this.state.simulation.isMainMenu = false
		this.state.simulation.isPaused = false
		this.state.simulation.isChoosing = false

		this.deathScreen()
	}

	draw() {
		this.drawSelf(function () {
			if (this.state.simulation.time - this.lastDamageTime < 0.1) draw.fillStyle = 'hsla(0, 100%, 50%, 0.85)'
			else draw.fillStyle = this.color

			if (this.isInvulnerable) {
				draw.globalAlpha = 0.4 + 0.4 * Math.sin(this.state.simulation.time * 25)
				draw.shadowBlur = 15 + 10 * Math.sin(this.state.simulation.time * 25)
				draw.shadowColor = 'white'
			}

			if (this.state.simulation.time < this._speedBoostUntil) {
				draw.shadowBlur = 20
				draw.shadowColor = 'hsl(190, 100%, 50%)'
			}

			draw.fillRect(this.size / -2, this.size / -2, this.size, this.size)

			if (
				this.state.input.cursor.angle < Math.PI / -2 ||
				this.state.input.cursor.angle > Math.PI / 2
			) draw.drawImage(sprites.commanderHat.left, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)
			else draw.drawImage(sprites.commanderHat.right, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)

			draw.rotate(this.state.input.cursor.angle)
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

	reset() {
		const d = this.defaults
		Object.assign(this, d)
		this.pos = { ...d.pos }
	}
}

var player = new Player(state, main.width / 2, main.height / 2)
