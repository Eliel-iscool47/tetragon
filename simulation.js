var simulation = {

	_collisions: collisions,
	get collisions() { return this._collisions },
	set collisions(val) { this._collisions = val },


	_isChoosing: false,
	get isChoosing() { return this._isChoosing },
	set isChoosing(val) { this._isChoosing = val },

	_consoleMessage: ``,
	get consoleMessage() { return this._consoleMessage },
	set consoleMessage(val) {
		this._consoleMessage = `
${val}
` },

	_isDead: false,
	get isDead() { return this._isDead },
	set isDead(val) { this._isDead = val },

	_isPaused: false,
	get isPaused() { return this._isPaused },
	set isPaused(val) {
		this._isPaused = val
		if (val) {
			const unique = [...new Set(upgrades.collected)]
			pauseScreen.innerHTML = `
			<div style="
				display: flex;
				width: 85%; 
				max-height: 85vh; 
				background: rgba(0, 0, 0, 0.9); 
				padding: 40px; 
				margin-top: 5vh; 
				border-radius: 20px; 
				border: 1px solid rgba(255, 255, 255, 0.1);
				box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
			">
				<div style="flex: 2; overflow-y: auto; padding-right: 30px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent;">
					<div style="text-align: left; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
						<h2 style="font-size: 28px; color: #aaa; margin-bottom: 10px;">Equipped Weapon:</h2>
						${guns.equippedGun ? `
							<div style="font-size: 22px; color: #fff;">
								<span style="color: hsl(115, 100%, 60%); font-weight: bold; text-transform: uppercase;">${guns.equippedGun.name}</span>
								<div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
									<span>${text('damage', 'Damage')}: ${(guns.equippedGun.damage * state.player.damageDone).toFixed(2)}</span>
									<span>${text('fire-rate', 'Fire Rate')}: ${(guns.equippedGun.fireRate * upgrades.fireRate).toFixed(2)}/s</span>
								</div>
							</div>
						` : `<p style="font-size: 20px; color: #666; font-style: italic;">No weapon equipped.</p>`}
					</div>

					<div style="text-align: left;">
						<h2 style="font-size: 28px; color: #aaa; margin-bottom: 20px;">Collected Upgrades:</h2>
						${unique.length > 0 ? unique.map(upg => {
				const count = upgrades.collected.filter(u => u === upg).length
				return `
								<div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; border-left: 5px solid hsl(215, 100%, 50%);">
									<div style="font-size: 24px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
										<span>${upg.name}</span>
										${count > 1 ? text('ammo', 'x' + count) : ''}
									</div>
									<div style="font-size: 18px; margin-top: 8px; line-height: 1.5; color: #ccc;">
										${upg.description}
									</div>
								</div>`
			}).join('') : `<p style="font-size: 20px; color: #666; font-style: italic;">No upgrades collected yet.</p>`}
					</div>
					<p style="margin-top: 30px; font-size: 18px; opacity: 0.5;">Press ${input.keybinds.pause.replace('Key', '').replace('Digit', '')} to Resume</p>
				</div>

				<div style="flex: 1; border-left: 2px solid rgba(255, 255, 255, 0.1); padding-left: 30px; text-align: left;">
					<h2 style="font-size: 28px; color: #aaa; margin-bottom: 20px;">Statistics</h2>
					<div style="font-size: 20px; line-height: 2; color: #fff;">
						<div style="margin-bottom: 10px;">${text('health', 'Health')}: <span style="float: right;">${Math.round(state.player.health)} / ${Math.round(state.player.maxHealth)}</span></div>
						<div style="margin-bottom: 10px;">${text('damage', 'Global Damage')}: <span style="float: right;">x${state.player.damageDone.toFixed(2)}</span></div>
						<div style="margin-bottom: 10px;">${text('damage-taken', 'Damage Taken')}: <span style="float: right;">x${state.player.damageTaken.toFixed(2)}</span></div>
						<div style="margin-bottom: 10px;">${text('movement-speed', 'Speed')}: <span style="float: right;">${state.player.velocity.toFixed(2)}</span></div>
						<div style="margin-bottom: 10px;">${text('fire-rate', 'Fire Rate')}: <span style="float: right;">x${upgrades.fireRate.toFixed(2)}</span></div>
						<div style="margin-bottom: 10px;">${text('reload', 'Reload Speed')}: <span style="float: right;">x${upgrades.reloadSpeed.toFixed(2)}</span></div>
						<div style="margin-bottom: 10px;">${text('magnet-range', 'Magnet Range')}: <span style="float: right;">${Math.round(upgrades.magnetRange)}px</span></div>
					</div>
				</div>
			</div>`
		}
	},

	_isTesting: false,
	get isTesting() { return this._isTesting },
	set isTesting(val) { this._isTesting = val },

	_time: 0,
	get time() { return this._time },
	set time(val) { this._time = val },

	get defaults() {
		return {
			collisions,
			isChoosing: false,
			consoleMessage: '',
			isDead: false,
			isPaused: false,
			isTesting: false,
			time: 0,
			isMainMenu: true,
			crosshairColor: 'black',
			Particles: [],
			fps: 60,
		}
	},

	set defaults(val) { throw new Error('simulation.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},

	isMainMenu: true,
	fps: 60,
	interval: undefined,
	crosshairColor: 'black',
	Particles: [],
	log(msg, style) {
		style ??= 'color: black; font-size: 14px;'
		this.consoleMessage = `
<span style="${style}">${msg}</span><br>
${this.consoleMessage}
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
		nameModal.style.display = 'none'
		start.style.display = 'block'
		controls.style.display = 'block'
		settings.style.display = 'block'
		leaderboardButton.style.display = 'block'
		feedbackButton.style.display = 'block'
		main.style.display = 'none'
		document.title = 'Tetragon: Main Menu'
		if (this.interval) clearInterval(this.interval)
		this.interval = undefined
		simulation.time = 0
		hud.Obj.style.display = 'none'
		dc.style.display = 'block'
		this.wipe()
	},
	wipe() {
		state.resetAll()
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
		hud.Obj.style.display = this.isPaused || this.isChoosing || this.isMainMenu || this.isDead ? 'none' : 'block'
		if (this.isMainMenu) {
			this.mainMenu()
			dc.style.display = 'block'
			return undefined
		}
		main.style.cursor = 'none'
		if (
			this.time - state.player.lastDamageTime < 0.1 &&
			!this.isDead &&
			!this.isPaused
		) {
			main.style.top = `${rand(-10, 10)}px`
			main.style.left = `${rand(-10, 10)}px`
		} else {
			main.style.top = '0px'
			main.style.left = '0px'
		}
		dc.style.display = 'none'
		main.style.filter = `saturate(${this.isDead ? 100 : 100 * Math.sqrt(state.player.health / state.player.maxHealth)}%)`
		if (this.isDead) {
			main.style.cursor = 'default'
			state.player.deathScreen()
			hud.Obj.style.display = 'none'
			pauseScreen.style.display = 'none'
			return undefined
		}
		if (state.player.health <= 0) {
			state.player.kill()
			this.isDead = true
			return undefined
		}
		state.player.health = Math.min(state.player.health, state.player.maxHealth)
		upgrades.applyRegen()
		if (!this.isPaused && !this.isChoosing) guns.logic()
		pauseScreen.style.display = this.isPaused ? 'flex' : 'none'
		chooseScreen.style.display = this.isChoosing ? 'block' : 'none'
		if (!this.isPaused && !this.isChoosing) this.time += 1 / this.fps
		state.player.draw()
		guns.equippedGun?.drawReload()
		collisions.border.left = state.player.size / 2
		collisions.border.right = main.width - state.player.size / 2
		collisions.border.top = state.player.size / 2
		collisions.border.bottom = main.height - state.player.size / 2
		mobs.drawMobs()
		mobs.healthBars()
		// this.particles = this.particles.filter(p => {
		// 	p.t += 0.05
		// 	const px = lerp(p.x, player.pos.x, p.t)
		// 	const py = lerp(p.y, player.pos.y, p.t)
		// 	draw.fillStyle = 'hsl(0, 100%, 22.5%)'
		// 	draw.beginPath()
		// 	draw.arc(px, py, 4, 0, Math.PI * 2)
		// 	draw.fill()
		// 	return p.t < 1
		// })
		particles.draw()
		particles.update()
		powerUps.draw()
		powerUps.logic()

		// LEVEL LOGIC

		if (level.isWon()) {
			mobs.list = []
			if (level.current <= 0 || this.time - level.time >= level.intermission) {
				level.next()
				level.make()
				level.time = this.time
			}
		} else {
			// Still mobs
			level.time = this.time
		}

		// Shotgun aim arc

		if (guns.equippedGun == guns.shotgun) {
			draw.beginPath()
			draw.lineWidth = 4
			draw.arc(state.player.pos.x, state.player.pos.y, state.player.size * 1.5, input.cursor.angle - guns.shotgun.spread * Math.PI / 360, input.cursor.angle + guns.shotgun.spread * Math.PI / 360, false)
			draw.strokeStyle = 'hsl(30, 100%, 50%)'
			draw.stroke()
		}

		bullets.draw()
		bullets.kill()
		bullets.drawExplosions()
		bullets.killExplosions()
		bullets.drawSlashes()
		bullets.killSlashes()
		bullets.drawFirePools()
		bullets.killFirePools()
		if (this.isTesting) this.crosshairColor = 'hsl(40,100%,50%)'
		else this.crosshairColor = 'black'
		hud.make()
		collisions.loop()
		bullets.move()
		mobs.loop()
		this.crosshair(16)
	},
	init() {
		if (this.interval) clearInterval(this.interval)
		this.interval = undefined
		
		this.wipe()

		main.style.display = 'block'
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.isTesting = false
		this.time = 0
		dc.style.display = 'none'
		main.style.cursor = 'default'
		pauseScreen.style.display = 'none'
		document.getElementById('name-modal').style.display = 'none'
		hud.Obj.style.display = 'block'
		this.collisions.grid.init()
		level.init() // Call level init here
		this.interval = setInterval(this.gameLoop.bind(this), 1000 / this.fps)
	},
	spawnVampireParticle(x, y) {

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
				draw.arc(0, 0, s * 0.5, 0, Math.PI * 2, false)
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
