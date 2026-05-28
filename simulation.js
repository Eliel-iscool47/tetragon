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

	get defaults() {
		return {
			collisions,
			isChoosing: false,
			isDead: false,
			isPaused: false,
			isDebug: false,
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
		if (this.menuParticles.length < 15) {
			this.menuParticles.push({
				x: rand(0, this.world.width),
				y: rand(0, this.world.height),
				size: rand(50, 200),
				angle: rand(0, Math.PI * 2),
				rot: rand(-0.005, 0.005),
				speed: rand(0.1, 0.4),
				points: randInt(3, 6),
				color: `hsla(${rand(180, 260)}, 60%, 50%, 0.06)` // Faded blue/purple geometric shapes
			})
		}

		this.menuParticles.forEach(p => {
			p.angle += p.rot
			p.x += Math.cos(p.angle) * p.speed
			p.y += Math.sin(p.angle) * p.speed

			if (p.x < -200) p.x = this.world.width + 200
			if (p.x > this.world.width + 200) p.x = -200
			if (p.y < -200) p.y = this.world.height + 200
			if (p.y > this.world.height + 200) p.y = -200

			draw.save()
			draw.translate(p.x, p.y)
			draw.rotate(p.angle)
			draw.fillStyle = p.color
			draw.strokeStyle = 'rgba(255, 255, 255, 0.03)'
			draw.lineWidth = 1
			draw.beginPath()
			polygon(0, 0, p.size, p.points)
			draw.fill()
			draw.stroke()
			draw.restore()
		})
	},
	mainMenu() {
		pauseScreen.style.display = 'none'
		nameModal.style.display = 'none'
		start.style.display = 'block'
		controls.style.display = 'block'
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
		draw.fillStyle = 'hsl(0, 0%, 80%)'
		draw.fillRect(0, 0, this.world.width, this.world.height)
		
		draw.strokeStyle = 'hsla(0, 0%, 30%, 0.20)'
		draw.lineWidth = 3

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
	gameLoop() {
		if (document.hidden) return undefined
		main.style.top = '0px'
		main.style.left = '0px'
		draw.clearRect(0, 0, main.width, main.height)

		const scaleX = main.width / this.world.width
		const scaleY = main.height / this.world.height

		input.keyLogic()
		// Always update joysticks if the container exists to ensure smooth visuals
		if (document.getElementById('mobile-controls')) input.updateJoysticks()

		nameModal.style.display = this.isPaused ? 'block' : 'none'

		const mCtrls = window.mobileControls || document.getElementById('mobile-controls')
		if (mCtrls && window.input) {
			// Show container if setting is enabled
			mCtrls.style.display = input.showMobileControls ? 'block' : 'none';
			
			const isGameplay = !this.isPaused && !this.isDead && !this.isChoosing && !this.isMainMenu;
			const isDead = this.isDead && !this.isMainMenu;
			const moveBase = document.getElementById('move-base');
			const aimBase = document.getElementById('aim-base');
			const fireBtn = document.getElementById('mobile-fire');
			const respawnBtn = document.getElementById('mobile-respawn');
			const quitBtn = document.getElementById('mobile-quit');
			const pauseBtn = document.getElementById('mobile-pause');
			const toggleBtn = document.getElementById('mobile-menu-toggle');
			const debugBtn = document.getElementById('mobile-debug');
			const cycleBtn = document.getElementById('mobile-gun-cycle');

			// Controls only appear during active gameplay to avoid blocking the Main Menu
			if (moveBase) moveBase.style.display = isGameplay ? 'block' : 'none';
			if (aimBase) aimBase.style.display = isGameplay ? 'block' : 'none';
			if (fireBtn) fireBtn.style.display = isGameplay && !input.isAutoFire ? 'block' : 'none';
			
			// UI buttons hide on the main menu to prevent clutter
			const hideUI = isDead || this.isMainMenu;
			if (pauseBtn) pauseBtn.style.display = hideUI ? 'none' : 'block';
			if (toggleBtn) toggleBtn.style.display = hideUI ? 'none' : 'block';
			if (debugBtn) debugBtn.style.display = hideUI ? 'none' : 'block';
			if (cycleBtn) cycleBtn.style.display = hideUI ? 'none' : 'block';

			// Death buttons only appear when dead
			if (respawnBtn) respawnBtn.style.display = isDead ? 'block' : 'none';
			if (quitBtn) quitBtn.style.display = isDead ? 'block' : 'none';
		}

		hud.Obj.style.display = this.isPaused || this.isChoosing || this.isMainMenu || this.isDead ? 'none' : 'block'

		draw.save()
		draw.scale(scaleX, scaleY)

		const saturation = this.isDead ? 0 : 100 * Math.sqrt(state.player.health / state.player.maxHealth)
		draw.filter = `saturate(${saturation}%)`
		this.background()

		if (this.isMainMenu) {
			this.drawMenuBackground()
			draw.restore()
			main.style.cursor = "default"
			return undefined
		}
		main.style.cursor = !this.isMainMenu && !this.isPaused && !this.isChoosing && !this.isDead ? "none" : "default"
		if (
			this.time - state.player.lastDamageTime < 0.1 &&
			!this.isDead &&
			!this.isPaused &&
			!this.isChoosing &&
			!this.isMainMenu
		) {
			main.style.top = `${rand(-10, 10)}px`
			main.style.left = `${rand(-10, 10)}px`
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
		if (!this.isPaused && !this.isChoosing) this.time += 1 / this.fps

		state.player.draw()
		guns.equippedGun?.drawReload()
		collisions.border.left = state.player.size / 2
		collisions.border.right = this.world.width - state.player.size / 2
		collisions.border.top = state.player.size / 2
		collisions.border.bottom = this.world.height - state.player.size / 2
		mobs.drawMobs()
		mobs.healthBars()
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
		collisions.loop()
		bullets.move()
		mobs.loop()
	},
	init() {
		if (this.interval) clearInterval(this.interval)
		this.interval = undefined
		
		this.wipe()

		main.style.display = 'block'
		main.width = window.innerWidth
		main.height = window.innerHeight
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.isDebug = false
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
