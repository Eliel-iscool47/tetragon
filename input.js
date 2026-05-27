var input = {
	pressedKeys: [],
	preventDefaultList: [
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Tab",
		"Escape",
		"Slash",
	],
	keybinds: {
		up: "KeyW",
		down: "KeyS",
		left: "KeyA",
		right: "KeyD",
		fire: "KeyF",
		debug: "KeyT",
		pause: "KeyP",
		gunLeft: "KeyQ",
		gunRight: "KeyE",
		respawn: "KeyR",
		mainMenu: "KeyM",
		reload: "KeyV",
		...JSON.parse(localStorage.getItem('tetragon-keybinds') || "{}"),
	},
	joystick: {
		active: false,
		moveX: 0,
		moveY: 0,
		visualX: 0, // For smooth thumb movement
		visualY: 0, // For smooth thumb movement
		touchId: null, // To track individual touches
	},
	aimJoystick: {
		active: false,
		moveX: 0,
		moveY: 0,
		visualX: 0, // For smooth thumb movement
		visualY: 0, // For smooth thumb movement
		touchId: null, // To track individual touches
	},
	isAutoFire: localStorage.getItem('tetragon-auto-fire') !== 'false',
	joystickSize: parseFloat(localStorage.getItem('tetragon-joystick-size') || "1.0"),
	cursor: {
		_x: 0, // Initialized to 0, will be set correctly in reset()
		get x() { return this._x },
		set x(val) { this._x = val },

		_y: 0, // Initialized to 0, will be set correctly in reset()
		get y() { return this._y },
		set y(val) { this._y = val },

		_angle: 0,
		get angle() { return this._angle },
		set angle(val) { this._angle = val },

		update(posX, posY) {
			const scaleX = main.width / (state.simulation?.world?.width || 1500)
			const scaleY = main.height / (state.simulation?.world?.height || 800)
			this._x = posX / scaleX
			this._y = posY / scaleY
			if (!state.simulation?.isPaused && state.player)
				this._angle = angle(this._x, this._y, state.player.pos.x, state.player.pos.y)
		},
	},
	fire() {
		if (!guns.equippedGun) {
			simulation.log("guns.equippedGun == undefined")
			return undefined
		}
		if ((!simulation.isDebug &&
			guns.equippedGun.ammo > 0 &&
			simulation.time - guns.lastBulletShot < 1 / (
				guns.equippedGun.fireRate * upgrades.fireRate
			)
		) || simulation.isPaused ||
			simulation.isChoosing
		) return undefined
		guns.equippedGun.shoot()
		if (guns.equippedGun.isMuzzleFlash && guns.equippedGun.ammo > 0) bullets.muzzleFlash()
		guns.lastBulletShot = simulation.time
	},
	rightClick() {
		simulation.log("right click")
	},
	middleClick() {
		simulation.log("middle click")
	},
	gunLeft() {
		if (simulation.isPaused || simulation.isChoosing || isNullish(guns.equippedGun)) return undefined
		guns.equippedGun = guns.inventory.at(
			(guns.inventory.indexOf(guns.equippedGun) - 1) % guns.inventory.length,
		)
	},
	gunRight() {
		if (simulation.isPaused || simulation.isChoosing || isNullish(guns.equippedGun)) return undefined
		guns.equippedGun = guns.inventory.at(
			(guns.inventory.indexOf(guns.equippedGun) + 1) % guns.inventory.length,
		)
	},
	reload() {
		if (!isNullish(guns.equippedGun)) guns.equippedGun.reload()
	},
	allGuns() {
		if (simulation.isDebug) guns.allGuns()
	},
	toggleDebug() {
		simulation.isDebug = !simulation.isDebug
	},
	pause() {
		simulation.isPaused = !simulation.isPaused
	},
	mainMenu() {
		simulation.isMainMenu = true
		simulation.mainMenu()
	},

	get defaults() {
		return { 
			pressedKeys: [],
			joystick: { active: false, moveX: 0, moveY: 0, visualX: 0, visualY: 0, touchId: null },
			aimJoystick: { active: false, moveX: 0, moveY: 0, visualX: 0, visualY: 0, touchId: null },
			isAutoFire: localStorage.getItem('tetragon-auto-fire') !== 'false',
			joystickSize: parseFloat(localStorage.getItem('tetragon-joystick-size') || "1.0"),
			cursor: { // Ensure cursor defaults are set based on collisions.center
				_x: state.collisions.center.x,
				_y: state.collisions.center.y,
				_angle: 0,
			}
		}
	},

	set defaults(val) { throw new Error('input.defaults is read-only') },

	reset() {
		const { cursor, ...rest } = this.defaults
		Object.assign(this, rest)
		Object.assign(this.cursor, cursor)
	},

	respawn() {
		if (
			!simulation.isPaused &&
			!simulation.isChoosing &&
			!simulation.isDead &&
			!simulation.isMainMenu
		) return undefined

		simulation.init()
	},
	clickLogic(click) {
		this.cursor.update(click.offsetX, click.offsetY)
		switch (click.button) {
			case 0:
				this.fire()
				break
			case 1:
				this.middleClick()
				break
			default:
				this.rightClick()
				break
		}
	},
	lilKeyLogic() {
		this.pressedKeys.forEach(function (k) {
			switch (k) {
				case this.keybinds.gunLeft:
					this.gunLeft()
					break
				case this.keybinds.gunRight:
					this.gunRight()
					break
				case this.keybinds.debug:
					this.toggleDebug()
					break
				case this.keybinds.pause:
					this.pause()
					break
				case 'Escape':
					this.pause()
					break
				case 'Tab':
					controlDoc.style.display = controlDoc.style.display == 'block' ? 'none' : 'block'
					break
				case this.keybinds.reload:
					this.reload()
					break
			}
		}.bind(this))
	},
	gamepadLogic() {
		const gamepad = navigator.getGamepads()[0]
		if (!gamepad) return
		if (Math.abs(gamepad.axes[2]) > 0.1 || Math.abs(gamepad.axes[3]) > 0.1) {
			this.cursor.update(state.player.pos.x + gamepad.axes[2] * 100, state.player.pos.y + gamepad.axes[3] * 100)
		}
		if (gamepad.buttons[7].pressed) this.fire()
	},
	keyLogic() {
		this.gamepadLogic()
		if (!(simulation.isPaused || simulation.isChoosing || simulation.isDead)) {
			// Moving
			let moveX = 0
			let moveY = 0

			// Keyboard
			if (this.pressedKeys.includes(this.keybinds.up) || this.pressedKeys.includes("ArrowUp")) moveY--
			if (this.pressedKeys.includes(this.keybinds.down) || this.pressedKeys.includes("ArrowDown")) moveY++
			if (this.pressedKeys.includes(this.keybinds.left) || this.pressedKeys.includes("ArrowLeft")) moveX--
			if (this.pressedKeys.includes(this.keybinds.right) || this.pressedKeys.includes("ArrowRight")) moveX++

			// Gamepad
			const gamepad = navigator.getGamepads()[0]
			if (gamepad) {
				if (Math.abs(gamepad.axes[0]) > 0.1) moveX += gamepad.axes[0]
				if (Math.abs(gamepad.axes[1]) > 0.1) moveY += gamepad.axes[1]
			}

			// Joystick (Mobile)
			if (simulation.isMobile && this.joystick.active) {
				moveX += this.joystick.moveX
				moveY += this.joystick.moveY
			}

			// Normalize and apply movement
			const magnitude = Math.sqrt(moveX * moveX + moveY * moveY)
			if (magnitude > 0) {
				// Use magnitude to prevent faster diagonal movement and allow for analog stick sensitivity
				const normalizedX = moveX / magnitude
				const normalizedY = moveY / magnitude
				state.player.pos.x += normalizedX * state.player.velocity * Math.min(1, magnitude)
				state.player.pos.y += normalizedY * state.player.velocity * Math.min(1, magnitude)
			}

			// Aim Joystick (Mobile)
			if (simulation.isMobile && this.aimJoystick.active) {
				// Directly set world coordinates for the cursor
				this.cursor.x = state.player.pos.x + this.aimJoystick.moveX * 200
				this.cursor.y = state.player.pos.y + this.aimJoystick.moveY * 200
				this.cursor.angle = angle(
					this.cursor.x,
					this.cursor.y,
					state.player.pos.x,
					state.player.pos.y,
				)
				
				if (Math.sqrt(this.aimJoystick.moveX ** 2 + this.aimJoystick.moveY ** 2) > 0.3) this.fire()
			}
		}
		this.pressedKeys.forEach(function (k) {
			switch (k) {
				case this.keybinds.fire:
				case 'MobileFire':
					this.fire()
					break
				case this.keybinds.respawn:
					this.respawn()
					break
				case this.keybinds.mainMenu:
					simulation.isMainMenu = true
					this.mainMenu()
					break
			}
		}.bind(this))
		if (state.player) {
			this.cursor.angle = angle(
				this.cursor.x,
				this.cursor.y,
				state.player.pos.x,
				state.player.pos.y,
			)
		}
	},
	updateJoysticks() {
		const lerpAmount = 0.25 // Adjust for more/less "smoothness"
		const update = (id, thumbId, stateRef) => {
			const thumb = document.getElementById(thumbId)
			const base = document.getElementById(id)
			if (!thumb || !base) return
			const maxRadius = base.offsetWidth / 2
			// Smoothly interpolate visual position toward the input target
			stateRef.visualX = lerp(stateRef.visualX, stateRef.moveX * maxRadius, lerpAmount)
			stateRef.visualY = lerp(stateRef.visualY, stateRef.moveY * maxRadius, lerpAmount)
			thumb.style.transform = `translate(${stateRef.visualX}px, ${stateRef.visualY}px)`
		}
		update('move-base', 'move-thumb', this.joystick)
		update('aim-base', 'aim-thumb', this.aimJoystick)
	},
	_setupJoystick(baseId, thumbId, stateKey) {
		const base = document.getElementById(baseId)
		if (!base) return
		let touchId = null
		let rect = base.getBoundingClientRect()

		const processInput = (touch) => {
			const stateRef = this[stateKey] // Dynamic lookup for the current joystick object
			if (!rect) rect = base.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const centerY = rect.top + rect.height / 2

			let dx = touch.clientX - centerX
			let dy = touch.clientY - centerY
			const dist = Math.sqrt(dx * dx + dy * dy)
			const maxRadius = rect.width / 2

			if (dist > maxRadius) {
				dx = (dx / dist) * maxRadius
				dy = (dy / dist) * maxRadius
			}

			stateRef.moveX = dx / maxRadius
			stateRef.moveY = dy / maxRadius
		}

		base.addEventListener('touchstart', (e) => {
			e.preventDefault()
			rect = base.getBoundingClientRect()
			const touch = e.changedTouches[0]
			touchId = touch.identifier // Store the identifier for this touch
			this[stateKey].active = true
			processInput(touch)
		}, { passive: false })

		window.addEventListener('touchmove', (e) => {
			if (touchId === null) return
			const touch = Array.from(e.touches).find(t => t.identifier === touchId)
			if (touch && this[stateKey].active) { // Only process if this joystick is active and the touch matches
				e.preventDefault()
				processInput(touch)
			}
		}, { passive: false })

		const end = (e) => {
			const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId)
			if (touch) {
				touchId = null // Clear the touch ID
				this[stateKey].active = false // Deactivate joystick
				this[stateKey].moveX = 0 // Reset movement
				this[stateKey].moveY = 0 // Reset movement
			}
		}
		window.addEventListener('touchend', end)
		window.addEventListener('touchcancel', end)
	},
	initJoystick() {
		this._setupJoystick('move-base', 'move-thumb', 'joystick')
		this._setupJoystick('aim-base', 'aim-thumb', 'aimJoystick')
	},
}

//actually handling input
window.addEventListener("resize", function (r) {
	main.width = window.innerWidth
	main.height = window.innerHeight
	const world = state.simulation.world || { width: 1500, height: 800 }
	collisions.border.right = world.width - (state.player?.size || 50) / 2
	collisions.border.bottom = world.height - (state.player?.size || 50) / 2
	draw.clearRect(0, 0, main.width, main.height)
	collisions.grid.init()
})
main.addEventListener("contextmenu", function (cxm) {
	cxm.preventDefault()
	input.rightClick()
})
main.addEventListener("click", function (c) {
	input.clickLogic(c)
	switch (c.button) {
		case 0:
			input.clickLogic(c)
			break
		case 1:
			input.middleClick()
			break
		default:
			input.rightClick()
			break
	}
})
main.addEventListener("mousemove", function (m) {
	input.cursor.update(m.offsetX, m.offsetY)
})
document.addEventListener("keydown", function (k) {
	if (input.preventDefaultList.includes(k.code)) k.preventDefault()
	if (input.pressedKeys.includes(k.code)) return undefined
	input.pressedKeys.push(k.code)
	input.lilKeyLogic()
})
document.addEventListener("keyup", function (k) {
	if (input.pressedKeys.includes(k.code)) input.pressedKeys = input.pressedKeys.filter(function (key) { return key != k.code }.bind(this))
	input.lilKeyLogic()
})
