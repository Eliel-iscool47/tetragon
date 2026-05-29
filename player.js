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
			_damageBoostUntil: 0,
			_defenseBoostUntil: 0,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
			_speedBoostUntil: 0,
			_size: 50,
			_killer: null,
			_velocity: 5,
			_deathAlpha: 0,
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
			_damageBoostUntil: 0,
			_defenseBoostUntil: 0,
			_isInvulnerable: false,
			_invulnerableUntil: 0,
			_speedBoostUntil: 0,
			_size: 50,
			_deathAlpha: 0,
			_killer: null,
			_velocity: 5,
			color: 'hsl(215, 100%, 45%)',
			pos: { x: main.width / 2, y: main.height / 2 }
		}
	}

	set defaults(val) { throw new Error('player.defaults is read-only') }

	takeDamage(amount, source) {
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
		if (source) this._killer = source
		this.state.upgrades.lastHealthRegen = this.state.simulation.time

		// Trigger a short window of i-frames after taking damage to prevent "shotgunning" from multiple enemies.
		// This duration is scaled by the Iron Will upgrade.
		this.setInvulnerable(0.08 * this.state.upgrades.invulnerabilityDuration)

		// Knock back nearby enemies when taking damage to provide breathing room
		const knockbackRadius = this.size * 2.5
		const knockbackForce = 45
		this.state.collisions.grid.query(this.pos.x, this.pos.y, (mob) => {
			if (mob.isMob && mob.class !== 'projectile') {
				const dx = mob.pos.x - this.pos.x
				const dy = mob.pos.y - this.pos.y
				const distSq = dx * dx + dy * dy
				if (distSq < knockbackRadius * knockbackRadius && distSq > 0) {
					const dist = Math.sqrt(distSq)
					mob.pos.x += (dx / dist) * knockbackForce
					mob.pos.y += (dy / dist) * knockbackForce
				}
			}
		})
	}

	get health() { return this._health }
	set health(val) { this._health = Math.min(val, this.maxHealth) }

	get maxHealth() { return this._maxHealth }
	set maxHealth(val) {
		this._maxHealth = val
		this.health = Math.min(this.health, val)
	}

	get damageDone() { 
		return this.state.simulation.time < this._damageBoostUntil ? this._damageDone * 2.0 : this._damageDone 
	}
	set damageDone(val) { 
		const multiplier = this.state.simulation.time < this._damageBoostUntil ? 2.0 : 1
		this._damageDone = Math.abs(val / multiplier) 
	}

	get lastDamageTime() { return this._lastDamageTime }
	set lastDamageTime(val) { this._lastDamageTime = val }

	get damageTaken() { 
		return this.state.simulation.time < this._defenseBoostUntil ? this._damageTaken * 0.5 : this._damageTaken 
	}
	set damageTaken(val) { 
		const multiplier = this.state.simulation.time < this._defenseBoostUntil ? 0.5 : 1
		this._damageTaken = val / multiplier 
	}

	get isInvulnerable() { return this._isInvulnerable || this.state.simulation.time < this._invulnerableUntil }
	set isInvulnerable(val) { this._isInvulnerable = !!val }

	get size() { return this._size }
	set size(val) {
		this._size = val
	}

	get velocity() { 
		return this.state.simulation.time < this._speedBoostUntil ? this._velocity * 1.6 : this._velocity 
	}
	set velocity(val) {
		// If the player is currently boosted, we need to divide the incoming value by the multiplier
		// to ensure we only update the underlying base velocity (_velocity).
		const multiplier = this.state.simulation.time < this._speedBoostUntil ? 1.6 : 1
		this._velocity = Math.max(val / multiplier, 1)
	}

	setInvulnerable(duration) {
		this._invulnerableUntil = Math.max(this.state.simulation.time, this._invulnerableUntil) + duration
	}

	setDamageBoost(duration) {
		this._damageBoostUntil = this.state.simulation.time + duration
	}

	setDefenseBoost(duration) {
		this._defenseBoostUntil = this.state.simulation.time + duration
	}

	setSpeedBoost(duration) {
		this._speedBoostUntil = this.state.simulation.time + duration
	}

	deathScreen() {
		const pulse = 1 + Math.sin(this.state.simulation.time * 5) * 0.1
		const ts = this.state.simulation.timeScale
		this._deathAlpha = Math.min(1, this._deathAlpha + 0.015 * ts)
		draw.save()
		draw.globalAlpha = this._deathAlpha
		draw.fillStyle = 'hsl(0, 100%, 40%)'
		draw.fillRect(0, 0, this.state.simulation.world.width, this.state.simulation.world.height) // Fill virtual world

		draw.save()
		draw.translate(this.state.simulation.world.width / 2, this.state.simulation.world.height / 2)
		draw.scale(pulse, pulse)
		draw.fillStyle = 'hsl(0, 0%, 100%)'
		draw.font = `115px 'DM Sans'`
		draw.textAlign = 'center'
		draw.textBaseline = 'middle'
		draw.fillText('Game Over', 0, -20)
		draw.restore()

		// Draw the random death message
		draw.textAlign = 'center'
		draw.fillStyle = 'rgba(255, 255, 255, 0.8)'
		draw.font = `italic 30px 'DM Sans'`
		draw.fillText(this.state.simulation.deathMessage, this.state.simulation.world.width / 2, this.state.simulation.world.height / 2 + 55)
		
		// Draw the leaderboard submission status
		draw.textAlign = 'center'
		draw.fillStyle = 'rgb(55, 215, 255)'
		draw.font = `28px \'DM Sans\'`
		draw.fillText(this.state.simulation.scoreStatus, this.state.simulation.world.width / 2, this.state.simulation.world.height / 2 + 190)
		
		if (!this.state.simulation.isMobile) {
			draw.fillStyle = 'hsl(0, 0%, 100%)'
			draw.font = `50px 'DM Sans'`
			draw.fillText(`Press ${this.state.input.keybinds.respawn.replace('Key', '').replace('Digit', '')} to Respawn`, this.state.simulation.world.width / 2, this.state.simulation.world.height / 2 + 95)
			draw.font = `25px 'DM Sans'`
			draw.fillText(`or ${this.state.input.keybinds.mainMenu.replace('Key', '').replace('Digit', '')} for Main Menu`, this.state.simulation.world.width / 2, this.state.simulation.world.height / 2 + 130)
		}
		document.title = `Tetragon: Score: ${Math.round(this.state.level.current * this.state.simulation.scoreMultiplier)}`
		draw.restore()
	}

	kill() {
		this.health = 0

		let message = ""
		const killer = this._killer

		if (killer && killer.class === 'boss') {
			const bossMessages = [
				`Boss's brutal blow, your battle's been brought low.`,
				`Felled by a foe, your final flow.`,
				`The ${killer.type} triumphs, your time is now through.`,
				`A boss's big bash, your body's a dash.`
			]
			message = bossMessages[Math.floor(Math.random() * bossMessages.length)]
		} else {
			const genericMessages = [
				"Try dodging next time!",
				"Womp womp.",
				"Skill issue?",
				"That's gotta hurt.",
				"F in the chat.",
				"Better luck next time!",
				"Geometric failure.",
				"You were doing so well...",
				"Get good.",
				"Square up next time.",
				"Albert Epstein better than bro",
			]
			
			if (killer && Math.random() < 0.4) {
				const imagineMessages = [
					`Imagine dying to a ${killer.type}, what a tragic tale!`,
					`Picture perishing to a ${killer.type}, a pitiful plight!`,
					`Conceive collapsing to a ${killer.type}, quite the cruel caper!`,
					`Fancy falling to a ${killer.type}, a foolish, final feat!`,
					`Dream of demise by a ${killer.type}, a dreadful, dire deed!`,
					`Envision ending by a ${killer.type}, an embarrassing exit!`,
					`Consider crumbling to a ${killer.type}, a calamitous conclusion!`,
					`Reflect on ruin by a ${killer.type}, a regrettable, rapid rest!`
				]
				message = imagineMessages[Math.floor(Math.random() * imagineMessages.length)]
			} else {
				message = genericMessages[Math.floor(Math.random() * genericMessages.length)]
			}
		}

		this.state.simulation.deathMessage = message

		const score = Math.round(this.state.level.current * this.state.simulation.scoreMultiplier)
		const highScore = Number(localStorage.getItem('tetragon-high-score') || 0)
		const multiplierText = this.state.simulation.scoreMultiplier > 1 ? ` (${this.state.simulation.scoreMultiplier}x Bonus)` : ""

		if (score > highScore) {
			this.state.simulation.scoreStatus = "New High Score!" + multiplierText
			localStorage.setItem('tetragon-high-score', score)
			if (window.submitHighScore) window.submitHighScore(score)
		} else {
			this.state.simulation.scoreStatus = multiplierText ? "Hardcore Bonus Applied" : ""
		}

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
		
		// Apply Gamemode Overrides
		if (this.state.simulation.gamemode === 'hardcore') {
			this.maxHealth = 30
			this.health = 30
		}
	}
}

var player = new Player(state, main.width / 2, main.height / 2)
