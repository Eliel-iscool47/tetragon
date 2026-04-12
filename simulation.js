const simulation = {
	_isChoosing: false,
	get isChoosing() { return this._isChoosing },
	set isChoosing(val) { this._isChoosing = val },

	_consoleMessage: ``,
	get consoleMessage() { return this._consoleMessage },
	set consoleMessage(val) { this._consoleMessage = val },

	_isDead: false,
	get isDead() { return this._isDead },
	set isDead(val) { this._isDead = val },

	_isPaused: false,
	get isPaused() { return this._isPaused },
	set isPaused(val) { this._isPaused = val },

	_isTesting: false,
	get isTesting() { return this._isTesting },
	set isTesting(val) { this._isTesting = val },

	_timeOffset: now(),
	get timeOffset() { return this._timeOffset },
	set timeOffset(val) { this._timeOffset = val },

	_startTime: now(),
	get startTime() { return this._startTime },
	set startTime(val) { this._startTime = val },

	_time: 0,
	get time() { return this._time },
	set time(val) { this._time = val },

	isMainMenu: true,
	fps: 60,
	interval: undefined,
	crosshairColor: 'black',
	log(msg, style) {
		style ??= 'color: black; font-size: 14px;'
		this.consoleMessage = `<p>
<span style="${style}">${msg}</span><br>
${this.consoleMessage}
</p>
		`
	},
	error(msg) {
		this.log(msg, `
			background-color: red; 
			font-size: 16px;

			`)
	},
	pause() {
		this.isPaused = true
	},
	resume() {
		this.isPaused = false
	},
	test() {
		this.isTesting = true
	},
	exitTest() {
		this.isTesting = false
	},
	mainMenu() {
		pauseScreen.style.display = 'none'
		start.style.display = 'block'
		controls.style.display = 'block'
		settings.style.display = 'block'
		creditsButton.style.display = 'block'
		main.style.display = 'none'
		document.title = 'Tetragon: Main Menu'
		simulation.startTime = now()
		simulation.timeOffset = now()
		simulation.absOffset = now()
		simulation.time = 0
		dc.style.display = 'block'
		this.wipe()
	},
	wipe() {
		level.current = 0
		level.time = 0
		this.isPaused = false
		this.isDead = false
		this.isTesting = false
		this.time = 0
		player.pos.x = collisions.center.x
		player.pos.y = collisions.center.y
		player.maxHealth = 100
		player.health = player.maxHealth
		player.velocity = 5
		player.damageDone = 1
		player.damageTaken = 1
		upgrades.healEffect = 1
		upgrades.ammoYield = 1
		upgrades.powerUpSpawnChance = 0.5
		upgrades.collected = []
		upgrades.pool = [...upgrades.defaultPool]
		bullets.explosions.damageDone = 8
		mobs.list = []
		bullets.list = []
		bullets.explosionList = []
		powerUps.list = []
		guns.inventory = []
		guns.equippedGun = undefined
	},
	/**
	 * This function is responsible for the game's loop. If it breaks, the whole canvas stops.
	 */
	gameLoop() {
		if (document.hidden) return undefined
		main.style.top = '0px'
		main.style.left = '0px'
		draw.clearRect(0, 0, main.width, main.height)
		input.keyLogic()
		main.style.display = this.isMainMenu || this.isChoosing ? 'none' : 'block'
		hud.Obj.style.display = simulation.isPaused || simulation.isChoosing ? 'none' : 'block'
		if (this.isMainMenu) {
			this.mainMenu()
			dc.style.display = 'block'
			return undefined
		}
		main.style.cursor = 'none'
		if (this.time - player.lastDamageTime < 0.08 && !this.isDead && !this.isPaused) {
			main.style.top = `${rand(-10, 10)}px`
			main.style.left = `${rand(-10, 10)}px`
		} else {
			main.style.top = '0px'
			main.style.left = '0px'
		}
		dc.style.display = 'none'
		main.style.filter = `saturate(${this.isDead ? 100 : 100 * player.health / player.maxHealth}%)`
		if (this.isDead) {
			main.style.cursor = 'default'
			player.deathScreen()
			hud.Obj.style.display = 'none'
			pauseScreen.style.display = 'none'
			return undefined
		}
		if (player.health <= 0) {
			player.kill()
			this.isDead = true
			return undefined
		}
		player.health = Math.min(player.health, player.maxHealth)
		upgrades.applyRegen()
		pauseScreen.style.display = this.isPaused ? 'block' : 'none'
		chooseScreen.style.display = this.isChoosing ? 'block' : 'none'
		if (!this.isPaused && !this.isChoosing) this.time += 1 / this.fps
		player.draw()
		collisions.border.left = player.size / 2
		collisions.border.right = main.width - player.size / 2
		collisions.border.top = player.size / 2
		collisions.border.bottom = main.height - player.size / 2
		mobs.drawMobs()
		mobs.healthBars()
		powerUps.draw()
		powerUps.logic()
		if (!mobs.list.some(m => m.class == 'boss')) {
			mobs.list = []
			if (level.current <= 0 || this.time - level.time >= level.intermission) {
				level.next()
				level.new()
				level.time = this.time
			}
		} else level.time = this.time
		if (guns.equippedGun == guns.shotgun) {
			draw.beginPath()
			draw.lineWidth = 4
			draw.arc(player.pos.x, player.pos.y, player.size * 1.5, input.cursor.angle - guns.shotgun.spread * Math.PI / 360, input.cursor.angle + guns.shotgun.spread * Math.PI / 360, false)
			draw.strokeStyle = 'hsl(30, 100%, 50%)'
			draw.stroke()
		}
		bullets.do()
		bullets.kill()
		bullets.drawExplosions()
		bullets.killExplosions()
		if (this.isTesting) this.crosshairColor = 'hsl(40,100%,50%)'
		else this.crosshairColor = 'black'
		hud.make()
		collisions.loop()
		bullets.move()
		mobs.loop()
		this.crosshair(16)
	},
	init() {
		main.style.display = 'block'
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.isTesting = false
		this.time = 0
		this.timeOffset = now()
		this.absOffset = now()
		this.startTime = now()
		this.absTime = 0
		dc.style.display = 'none'
		main.style.cursor = 'default'
		pauseScreen.style.display = 'none'
		hud.Obj.style.display = 'block'
		input.respawn()
		this.wipe()
		if (this.interval) clearInterval(this.interval)
		this.interval = setInterval(this.gameLoop.bind(this), 1000 / this.fps)
	},
	crosshair(s) {
		draw.strokeStyle = this.crosshairColor
		draw.lineWidth = 2
		draw.save()
		draw.translate(input.cursor.x, input.cursor.y)
		draw.rotate(input.cursor.angle)
		draw.beginPath()
		switch (true) {
			case guns.equippedGun == guns.grenadeLauncher || guns.equippedGun == guns.minigun:
				draw.moveTo(0, s * -0.5)
				draw.lineTo(0, s * 0.5)
				draw.moveTo(s * -0.5, 0)
				draw.lineTo(s * 0.5, 0)
				draw.stroke()
				draw.beginPath()
				draw.arc(0, 0, s * 0.5, 0, Math.PI * 2, false)
				draw.stroke()
				break
			case guns.equippedGun == guns.sniper:
				draw.rotate(-input.cursor.angle)
				draw.beginPath()
				draw.moveTo(0, 0)
				draw.lineTo(player.pos.x - input.cursor.x, player.pos.y - input.cursor.y)
				draw.strokeStyle = 'hsl(0, 100%, 40%)'
				draw.stroke()
				draw.rotate(input.cursor.angle)
				draw.beginPath()
				draw.strokeStyle = this.crosshairColor
				draw.moveTo(0, s * - 0.5)
				draw.lineTo(0, s * 0.5)
				draw.moveTo(s * - 0.5, 0)
				draw.lineTo(s * 0.5, 0)
				draw.stroke()
				break
			case guns.equippedGun == guns.missiles || guns.equippedGun == guns.flamethrower:
				draw.strokeRect(-s * 0.5, -s * 0.5, s, s)
				break
			case guns.equippedGun == guns.bouncyBalls:
				u.polygon(0, 0, s * 0.5, 8, Math.PI / 8)
				draw.stroke()
				break
			case guns.equippedGun == undefined:
				draw.arc(0, 0, s * 0.5, 0, Math.PI * 2, false)
				draw.stroke()
				break
			default:
				draw.moveTo(0, s * - 0.5)
				draw.lineTo(0, s * 0.5)
				draw.moveTo(s * - 0.5, 0)
				draw.lineTo(s * 0.5, 0)
				draw.stroke()
				break
		}
		draw.restore()
	},
}
