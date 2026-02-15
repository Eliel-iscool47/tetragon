const simulation = {
	isControlChange: false,
	consoleMsg: ``,
	isDead: false,
	isPaused: false,
	isTesting: false,
	timeOffset: utils.now(),
	absOffset: utils.now(),
	startTime: utils.now(),
	absTime: 0,
	time: 0,
	isMainMenu: true,
	FPS: 200,
	crosshairColor: 'black',
	camera: {
		x: 0,
		y: 0,
	},
	log(msg) {
		this.consoleMsg = msg
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
	crosshair(size) {
		draw.strokeStyle = this.crosshairColor
		draw.lineWidth = 2
		draw.beginPath()
		draw.moveTo(input.cursor.x - size / 2, input.cursor.y)
		draw.lineTo(input.cursor.x + size / 2, input.cursor.y)
		draw.moveTo(input.cursor.x, input.cursor.y - size / 2)
		draw.lineTo(input.cursor.x, input.cursor.y + size / 2)
		draw.stroke()
		draw.beginPath()
		switch (guns.equippedGun) {
			case guns.missiles:
				draw.arc(input.cursor.x, input.cursor.y, size / 2, 0, Math.PI * 2)
				break
			case guns.shotgun:
				draw.arc(input.cursor.x, input.cursor.y, size / 2, 0, Math.PI * 2)
				break
			default:
				break
		}
		draw.stroke()
	},
	mainMenu() {
		pauseScreen.style.display = 'none'
		start.style.display = 'block'
		controls.style.display = 'block'
		settings.style.display = 'block'
		credits.style.display = 'block'
		main.style.display = 'none'
		document.title = 'Tetragon: Main Menu'
		simulation.startTime = utils.now()
		simulation.timeOffset = utils.now()
		simulation.absOffset = utils.now()
		simulation.time = 0
		container.style.display = 'block'
	},
	wipe() {
		level.current = 0
		level.time = 0
		this.isMainMenu = false
		this.isPaused = false
		this.isDead = false
		this.isTesting = false
		this.time = 0
		player.pos.x = collisions.center.x
		player.pos.y = collisions.center.y
		player.maxHealth = 100
		player.health = player.maxHealth
		mobs.list = []
		bullets.list = []
		bullets.explosions = []
		powerUps.list = []
		guns.inventory = []
		guns.equippedGun = undefined
	},
	gameLoop() {
		main.style.top = '0px'
		main.style.left = '0px'
		draw.clearRect(0, 0, main.width, main.height)
		input.keyLogic()
		pauseSubtext.innerText = `Press ${input.keybinds.pause.replace('Key', '').replace('Digit', '')} to pause or ${input.keybinds.mainMenu.replace('Key', '').replace('Digit', '')} to return to the main menu.`

		if (this.isMainMenu) {
			this.mainMenu()
		} else {
			this.isControlChange = false
			main.style.cursor = 'none'
			main.style.display = 'block'
			main.style.top = '0px'
			main.style.left = '0px'
			container.style.display = 'none'
			if (this.isDead) {
				main.style.cursor = 'default'
				player.deathScreen()
			}
			else {
				if (player.health <= 0) player.kill()
				else {
					player.health = Math.min(player.health, player.maxHealth)
					if (this.isPaused) {
						this.timeOffset = utils.now() - this.time
						this.absOffset = utils.now() - this.absTime
					}
					pauseScreen.style.display = this.isPaused ? 'block' : 'none'
					this.time = utils.now() - this.timeOffset
					this.absTime = utils.now() - this.absOffset
					player.draw(player.pos.x, player.pos.y)
					collisions.border.left = player.size / 2
					collisions.border.right = main.width - player.size / 2
					collisions.border.top = player.size / 2
					collisions.border.bottom = main.height - player.size / 2
					mobs.drawMobs()
					powerUps.draw()
					powerUps.logic()
					if (mobs.list.length <= 0) {
						if (level.current <= 0 || this.time - level.time >= level.intermission) {
							level.next()
							level.new()
							level.time = this.time
						}
					} else level.time = this.time
					bullets.drawBullets()
					bullets.kill()
					bullets.drawExplosions()
					bullets.killExplosions()
					if (this.isTesting) this.crosshairColor = 'hsl(40,100%,50%)'
					else this.crosshairColor = 'black'
					hud.make()
					collisions.players()
					collisions.mobs()
					if (!this.isPaused) {
						bullets.move()
						mobs.logic()
					}
				}
			}
		}
		this.crosshair(16)
	},
}
simulation.gameLoop()
setInterval(() => {
	simulation.gameLoop()
}, 1000 / simulation.FPS)