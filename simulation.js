var simulation = {

	_collisions: collisions,
	get collisions() { return this._collisions },
	set collisions(val) { this._collisions = val },

	_scoreStatus: "",
	get scoreStatus() { return this._scoreStatus },
	set scoreStatus(val) { this._scoreStatus = val },

	_deathMessage: "",
	get deathMessage() { return this._deathMessage },
	set deathMessage(val) { this._deathMessage = val },

	_gamemode: 'standard',
	get gamemode() { return this._gamemode },
	set gamemode(val) { this._gamemode = val },

	_isChoosing: false,
	get isChoosing() { return this._isChoosing },
	set isChoosing(val) { this._isChoosing = val },

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
				width: 90%; 
				height: 85%;
				margin: 5% auto;
				background: rgba(15, 15, 15, 0.95); 
				padding: 40px; 
				border-radius: 20px; 
				border: 1px solid rgba(255, 255, 255, 0.1);
				box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
				color: white;
			">
				<div style="flex: 2; overflow-y: auto; padding-right: 30px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;">
					<div style="text-align: left; margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 20px;">
						<h2 style="font-size: 28px; color: #aaa; margin-bottom: 10px;">Equipped Weapon:</h2>
						${guns.equippedGun ? `
							<div style="font-size: 22px; color: #fff;">
								<span style="color: hsl(115, 100%, 60%) ; font-weight: bold; text-transform: uppercase;">${guns.equippedGun.name}</span>
								<div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
									<span>${text('damage', 'Damage')}: ${(guns.equippedGun.damage * state.player.damageDone).toFixed(2)}</span>
									<span>${text('fire-rate', 'Fire Rate')}: ${(guns.equippedGun.fireRate * upgrades.fireRate).toFixed(2)}/s</span>
								</div>
							</div>
						` : `<p style="font-size: 20px; color: #888; font-style: italic;">No weapon equipped.</p>`}
					</div>

					<div style="text-align: left;">
						<h2 style="font-size: 28px; color: #555; margin-bottom: 20px;">Collected Upgrades:</h2>
						${unique.length > 0 ? unique.map(upg => {
				const count = upgrades.collected.filter(u => u === upg).length
				return `
								<div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.03); border-radius: 10px; border-left: 5px solid hsl(215, 100%, 50%);">
									<div style="font-size: 24px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
										<span>${upg.name}</span>
										${count > 1 ? text('ammo', 'x' + count) : ''}
									</div>
									<div style="font-size: 18px; margin-top: 8px; line-height: 1.5; color: #333;">
										${upg.description}
									</div>
								</div>`
			}).join('') : `<p style="font-size: 20px; color: #888; font-style: italic;">No upgrades collected yet.</p>`}
					</div>
					<p style="margin-top: 30px; font-size: 18px; opacity: 0.5;">Press ${input.keybinds.pause.replace('Key', '').replace('Digit', '')} to Resume</p>
				</div>

				<div style="flex: 1; border-left: 2px solid rgba(0, 0, 0, 0.1); padding-left: 30px; text-align: left;">
					<h2 style="font-size: 28px; color: #aaa; margin-bottom: 20px;">Statistics</h2>
					<button onclick="simulation.showUpdates()" style="width: 100%; padding: 10px; margin-bottom: 20px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; cursor: pointer; font-family: 'DM Sans';">Show Recent Updates</button>
					<div style="font-size: 20px; line-height: 2; color: #fff;">
						<div style="margin-bottom: 10px; color: ${this.gamemode === 'hardcore' ? '#ff4444' : '#44ff44'}">Mode: <span style="float: right;">${this.gamemode.toUpperCase()}</span></div>
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

	_isDebug: false,
	get isDebug() { return this._isDebug },
	set isDebug(val) { this._isDebug = val },

	_isMobile: (function() { return (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
		(navigator.maxTouchPoints > 0) || ('ontouchstart' in window) || 
		(window.matchMedia && (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(any-pointer: coarse)").matches)) ||
		(navigator.userAgentData && navigator.userAgentData.mobile) ||
		// Fallback for Firefox touch detection
		(window.matchMedia && window.matchMedia("(any-hover: none)").matches)
	)})(),
	get isMobile() {
		// Safe check for the manual setting
		const setting = (window.input && input.showMobileControls) || (window.state && state.input && state.input.showMobileControls);
		return this._isMobile || setting;
	},

	_world: { width: 1500, height: 800 },
	get world() { return this._world },

	_time: 0,
	get time() { return this._time },
	set time(val) { this._time = val },

	_timeScale: 1,
	get timeScale() { return this._timeScale },

	get scoreMultiplier() {
		return this.gamemode == 'hardcore' ? 3 : 1
	},

	shake: 0,

	showUpdates() {
		alert("v1.14: Delta-Time & Survival Update\n\n" +
			"• Frame-Independent Logic: Game speed remains consistent across refresh rates.\n" +
			"• Survival Mechanics: Added I-Frames and Defensive Knockback.\n" +
			"• Hardcore Mode: Features a 30 HP Challenge and a 3x Score Multiplier.\n" +
			"• Collision Engine 2.0: Optimized squared distance checks.");
	},

	get defaults() {
		return {
			collisions,
			isChoosing: false,
			isDead: false,
			isPaused: false,
			isDebug: false,
			gamemode: this.gamemode || 'standard',
			time: 0,
			isMainMenu: true,
			_world: { width: 1500, height: 800 },
			scoreStatus: "",
			deathMessage: "",
			crosshairColor: 'black',
			Particles: [],
			menuParticles: [],
			fps: 60,
			_isMobile: this._isMobile,
			_timeScale: 1,
			shake: 0,
		}
	},

	set defaults(val) { throw new Error('simulation.defaults is read-only') },

reset() {
		this._lastFrameTime = performance.now()
		this._timeScale = 1
		Object.assign(this, this.defaults)

		// Ensure menu particles don't inherit any prior angular state when re-entering.
		// (They are animated via p.rot in drawMenuBackground.)
		this.menuParticles = []
		this._menuParticlesInitialized = false
	},

	isMainMenu: true,
	fps: 60,
	interval: undefined,
	_isLooping: false,
	_mobileUiCache: null,
	crosshairColor: 'black',
	_lastFrameTime: 0,
	Particles: [],
	menuParticles: [],
	log(msg) {
		console.log(`[Simulation Log]: ${msg}`);
	},
	error(msg) {
		console.error(`[Simulation Error]: ${msg}`);
	},
	pause() {
		this.isPaused = true
	},
	resume() {
		this.isPaused = false
	},
	drawMenuBackground() {
		if (!this.isMainMenu) return undefined
		const targetCount = 15
		const minAlpha = 0.2

		// Spawn + keep menu particles alive indefinitely (no fade-out despawn).
		if (this.menuParticles.length < targetCount) {
			const missing = targetCount - this.menuParticles.length
			for (let k = 0; k < missing; k++) {
				this.menuParticles.push({
					x: rand(0, this.world.width),
					y: rand(0, this.world.height),
					size: rand(20, 200),
					angle: rand(-Math.PI, Math.PI),
					rot: rand(-0.015, 0.015),
					speed: rand(0.1, 0.4),
					points: randInt(3, 8),
					alpha: rand(0.3, 0.8),
					hue: rand(160, 230),
				})
			}
		}

		this.menuParticles.forEach(p => {
			// Movement (frame-rate independent)
			const ts = this.timeScale ?? 1
			p.angle += p.rot * ts
			p.x += Math.cos(p.angle) * p.speed * ts
			p.y += Math.sin(p.angle) * p.speed * ts


			// Wrap around when they go offscreen.
			// (Keep a small buffer so they re-enter smoothly.)
			const buf = 10
			if (p.x < -buf) p.x = this.world.width + buf
			if (p.x > this.world.width + buf) p.x = -buf
			if (p.y < -buf) p.y = this.world.height + buf
			if (p.y > this.world.height + buf) p.y = -buf

			// Drawing
			// const alphaRange = 0.05
			// p.alpha = clamp(p.alpha + rand(-alphaRange / 2, alphaRange / 2), 0.3, 0.85)
			// const hueRange = 10
			// p.hue = clamp(p.hue + rand(-hueRange / 2, hueRange / 2), 170, 230)
			p.color = `hsla(${p.hue}, 100%, 50%, ${p.alpha})`

			draw.save()
			draw.translate(p.x, p.y)
			draw.rotate(p.angle)
			draw.globalAlpha = p.alpha
			draw.fillStyle = p.color

			draw.beginPath()
			polygon(0, 0, p.size, p.points)
			draw.fill()
			draw.restore()
		})
	},

	mainMenu() {
		pauseScreen.style.display = 'none'
		nameModal.style.display = 'none'
		start.style.display = 'block'
		// controls.style.display = 'block'
		settings.style.display = 'block'
		leaderboardButton.style.display = 'block'
		feedbackButton.style.display = 'block'
		main.style.display = 'block'
		document.title = 'Tetragon: Main Menu'
		simulation.time = 0
		hud.Obj.style.display = 'none'
		dc.style.display = 'block'
		this.wipe()
	},
	wipe() {
		state.resetAll()
	},
	background() {
		const step = 100
		draw.save()
		draw.fillStyle = 'hsl(0, 0%, 95%)'
		draw.fillRect(0, 0, this.world.width, this.world.height)
		
		draw.strokeStyle = 'hsla(0, 0%, 20%, 0.2)'
		draw.lineWidth = 4

		// Vertical lines
		for (let x = 0; x <= this.world.width; x += step) {
			draw.beginPath()
			draw.moveTo(x, 0)
			draw.lineTo(x, this.world.height)
			draw.stroke()
		}

		// Horizontal lines
		for (let y = 0; y <= this.world.height; y += step) {
			draw.beginPath()
			draw.moveTo(0, y)
			draw.lineTo(this.world.width, y)
			draw.stroke()
		}
		draw.restore()
	},
	/**
	 * This function is responsible for the game's loop. If it breaks, the whole canvas stops.
	 */
	gameLoop(now = performance.now()) {
		if (document.hidden || !this._isLooping) return undefined
		requestAnimationFrame((t) => this.gameLoop(t))

		const dt = Math.min(0.1, (now - this._lastFrameTime) / 1000)
		this._lastFrameTime = now
		this._timeScale = dt * 60 // Normalized to target 60fps

		draw.clearRect(0, 0, main.width, main.height)

		const scaleX = main.width / this.world.width
		const scaleY = main.height / this.world.height

		input.keyLogic()
		// Always update joysticks if the container exists to ensure smooth visuals
		if (window.mobileControls) input.updateJoysticks()

		nameModal.style.display = this.isPaused ? 'block' : 'none'

		const mCtrls = window.mobileControls
		if (mCtrls && window.input) {
			// Show container if setting is enabled
			mCtrls.style.display = input.showMobileControls ? 'block' : 'none';
			
			const isGameplay = !this.isPaused && !this.isDead && !this.isChoosing && !this.isMainMenu;
			const isDead = this.isDead && !this.isMainMenu;

			// Cache DOM lookups for performance
			if (!this._mobileUiCache) {
				this._mobileUiCache = {
					move: document.getElementById('move-base'),
					aim: document.getElementById('aim-base'),
					fire: document.getElementById('mobile-fire'),
					respawn: document.getElementById('mobile-respawn'),
					quit: document.getElementById('mobile-quit'),
					pause: document.getElementById('mobile-pause'),
					toggle: document.getElementById('mobile-menu-toggle'),
					debug: document.getElementById('mobile-debug'),
					cycle: document.getElementById('mobile-gun-cycle')
				}
			}
			const ui = this._mobileUiCache;

			// Controls only appear during active gameplay to avoid blocking the Main Menu
			if (ui.move) ui.move.style.display = isGameplay ? 'block' : 'none';
			if (ui.aim) ui.aim.style.display = isGameplay ? 'block' : 'none';
			if (ui.fire) ui.fire.style.display = isGameplay && !input.isAutoFire ? 'block' : 'none';
			
			// UI buttons hide on the main menu to prevent clutter
			const hideUI = isDead || this.isMainMenu;
			if (ui.pause) ui.pause.style.display = hideUI ? 'none' : 'block';
			if (ui.toggle) ui.toggle.style.display = hideUI ? 'none' : 'block';
			if (ui.debug) ui.debug.style.display = hideUI ? 'none' : 'block';
			if (ui.cycle) ui.cycle.style.display = hideUI ? 'none' : 'block';

			// Death buttons only appear when dead
			if (ui.respawn) ui.respawn.style.display = isDead ? 'block' : 'none';
			if (ui.quit) ui.quit.style.display = isDead ? 'block' : 'none';
		}

		hud.Obj.style.display = this.isPaused || this.isChoosing || this.isMainMenu || this.isDead ? 'none' : 'block'

		draw.save()
		draw.scale(scaleX, scaleY)

		this.background()
		this.applySaturationEffect()

		if (this.isMainMenu) {
			this.drawMenuBackground()
			draw.restore()
			main.style.cursor = "default"
			return undefined
		}
		main.style.cursor = !this.isMainMenu && !this.isPaused && !this.isChoosing && !this.isDead ? "none" : "default"
		
		if (this.shake > 0 && !this.isPaused && !this.isChoosing) {
			main.style.top = `${rand(-this.shake, this.shake)}px`
			main.style.left = `${rand(-this.shake, this.shake)}px`
			this.shake *= Math.pow(0.9, this.timeScale)
			if (this.shake < 0.1) this.shake = 0
		} else {
			main.style.top = '0px'
			main.style.left = '0px'
		}
		dc.style.display = 'none'
		main.style.filter = 'none'
		state.player.health = Math.min(state.player.health, state.player.maxHealth)
		upgrades.applyRegen()
		if (!this.isPaused && !this.isChoosing) guns.logic()
		pauseScreen.style.display = this.isPaused ? 'flex' : 'none'
		chooseScreen.style.display = this.isChoosing ? 'block' : 'none'
		if (!this.isPaused && !this.isChoosing) this.time += dt

		state.player.draw()
		guns.equippedGun?.drawReload()
		collisions.border.left = state.player.size / 2
		collisions.border.right = this.world.width - state.player.size / 2
		collisions.border.top = state.player.size / 2
		collisions.border.bottom = this.world.height - state.player.size / 2
		mobs.drawMobs()
		mobs.healthBars()
		particles.draw()
		particles.update(this.timeScale)
		powerUps.draw()
		powerUps.logic(this.timeScale)

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

		draw.filter = 'none'

		if (this.isDead) {
			main.style.cursor = 'default'
			state.player.deathScreen()
			hud.Obj.style.display = 'none'
			pauseScreen.style.display = 'none'
			draw.restore()
			return undefined
		}
		if (state.player.health <= 0) {
			state.player.kill()
			this.isDead = true
			draw.restore()
			main.style.cursor = 'default'
			return undefined
		}

		this.crosshair(16)
		draw.restore() // End World Scaling

		if (this.isDebug) {
			this.crosshairColor = 'hsl(40,100%,50%)'
			
			// Debug Text Overlay
			draw.save()
			draw.fillStyle = 'rgba(0, 0, 0, 0.6)'
			draw.fillRect(20, 20, 200, 105)
			draw.strokeStyle = 'white'
			draw.lineWidth = 1
			draw.strokeRect(20, 20, 200, 105)

			draw.fillStyle = 'white'
			draw.font = 'bold 16px "DM Sans"'
			draw.fillText(`DEBUG INFO`, 35, 45)
			draw.font = '14px monospace'
			const mCount = mobs.list.filter(m => m.class !== 'projectile').length
			const pCount = mobs.list.filter(m => m.class === 'projectile').length
			const bCount = bullets.list.length
			draw.fillText(`Mobs:        ${mCount}`, 35, 70)
			draw.fillText(`Projectiles: ${pCount}`, 35, 87)
			draw.fillText(`Bullets:     ${bCount}`, 35, 104)
			draw.restore()
		}
		else this.crosshairColor = 'black'
		hud.make()
		collisions.loop(this.timeScale)
		bullets.move(this.timeScale)
		mobs.loop(this.timeScale)
	},
	applySaturationEffect() {
		const saturation = this.isDead ? 0 : 100 * Math.sqrt(state.player.health / state.player.maxHealth)
		if (saturation < 100) {
			draw.save()
			draw.globalCompositeOperation = 'color'
			draw.globalAlpha = 1 - (saturation / 100)
			draw.fillStyle = 'gray'
			draw.fillRect(0, 0, this.world.width, this.world.height)
			draw.restore()
		}
	},
	respawn() {
		// Full restart (like fresh from main menu) but keeping the same page load.
		// This resets BOTH runtime state and run progression state.
		this.wipe()

		// Ensure we return to the “playing” state (not the main menu UI).
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.isChoosing = false

		this.time = 0
		this._timeScale = 1
		this._lastFrameTime = performance.now()

		// Reset runtime lists to prevent “accumulation” across respawns.
		mobs.list = []
		bullets.list = []
		bullets.explosionList = []
		bullets.slashList = []
		bullets.firePoolList = []

		powerUps.list = []
		particles.list = []
		particles.pool = []

		// Reset grids / level state.
		this.collisions.grid.init()
		level.init() // reload level config (async but safe)

		// Ensure run-scoped HUD/status values start fresh.
		this.shake = 0
		this.scoreStatus = ''
		this.deathMessage = ''
	},


	init() {
		// Reset the entire game state and ensure only ONE RAF loop is active.
		this._mobileUiCache = null
		this.wipe()
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.collisions.grid.init()
		level.init() // Call level init here
		this._lastFrameTime = performance.now()

		// Prevent duplicate RAF chains if init() is triggered more than once.
		this._isLooping = true
		if (!this._rafStarted) {
			this._rafStarted = true
			this.gameLoop()
		}
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
