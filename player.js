/**
 * The object containing all the information about the player.
 */
class Player extends Entity {
	constructor(state, x, y) {
		super(state, x, y, {
			_health: 100,
			_maxHealth: 100,
			_shield: 0,
			_maxShield: 0,
			_damageDone: 1,
			_lastDamageTime: -(10 ** 299),
			_damageTaken: 1,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
			_size: 50,
			_velocity: 5,
			color: 'hsl(215, 100%, 45%)',
		})
	}

	get defaults() {
		return {
			_health: 100,
			_maxHealth: 100,
			_shield: 0,
			_maxShield: 0,
			_damageDone: 1,
			_lastDamageTime: -(10 ** 299),
			_damageTaken: 1,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
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

	get shield() { return this._shield }
	set shield(val) { this._shield = Math.min(val, this.maxShield) }

	get maxShield() { return this._maxShield }
	set maxShield(val) {
		this._maxShield = val
		this.shield = Math.min(this.shield, val)
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

	get velocity() { return this._velocity }
	set velocity(val) { this._velocity = Math.max(val, 1) }

	setInvulnerable(duration) {
		this._invulnerableUntil = this.state.simulation.time + duration
	}

	deathScreen() {
		draw.fillStyle = 'hsl(0, 100%, 30%)'
		draw.fillRect(0, 0, main.width, main.height)
		draw.fillStyle = 'hsl(0, 0%, 0%)'
		draw.font = `${(main.width + main.height) / 20}px 'DM Sans'`
		draw.textAlign = 'center'
		draw.fillText('Game Over', main.width / 2, main.height / 2)
		draw.font = `${(main.width + main.height) / 40}px 'DM Sans'`
		draw.fillText(`press ${this.state.input.keybinds.respawn.replace('Key', '').replace('Digit', '')} to respawn\nor ${this.state.input.keybinds.mainMenu.replace('Key', '').replace('Digit', '')} to go back to the main menu`, main.width / 2, main.height / 2 + 75, main.width)
		document.title = `Tetragon: Score: ${Math.round(this.state.level.current)}`
	}

	kill() {
		this.health = 0
		const score = Math.round(this.state.level.current)
		const highScore = Number(localStorage.getItem('tetragon-high-score') || 0)
		if (score > highScore) {
			localStorage.setItem('tetragon-high-score', score)

			// Only show the submission modal if a new high score is achieved
			this.state.lastScore = score;
			document.getElementById('name-modal').style.display = 'flex';

			// Ensure the container is visible but the main menu buttons are hidden
			dc.style.display = 'block';
			start.style.display = 'none';
			settings.style.display = 'none';
			controls.style.display = 'none';
			feedbackButton.style.display = 'none';
			leaderboardButton.style.display = 'none';
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
