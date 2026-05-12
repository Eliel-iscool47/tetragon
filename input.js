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
		testing: "KeyT",
		pause: "KeyP",
		gunLeft: "KeyQ",
		gunRight: "KeyE",
		respawn: "KeyR",
		mainMenu: "KeyM",
		reload: "KeyV",
		...JSON.parse(localStorage.getItem('tetragon-keybinds') || "{}"),
	},
	cursor: {
		_x: collisions.center.x,
		get x() { return this._x },
		set x(val) { this._x = val },

		_y: collisions.center.y,
		get y() { return this._y },
		set y(val) { this._y = val },

		_angle: 0,
		get angle() { return this._angle },
		set angle(val) { this._angle = val },

		update(posX, posY) {
			this._x = posX
			this._y = posY
			if (!simulation.isPaused && state.player)
				this._angle = angle(this._x, this._y, state.player.pos.x, state.player.pos.y)
		},
	},
	fire() {
		if (!guns.equippedGun) {
			simulation.log("guns.equippedGun == undefined")
			return undefined
		}
		if ((!simulation.isTesting &&
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
		if (simulation.isTesting) guns.allGuns()
	},
	testing() {
		simulation.isTesting = !simulation.isTesting
	},
	pause() {
		simulation.isPaused = !simulation.isPaused
	},
	mainMenu() {
		simulation.isMainMenu = true
		simulation.isPaused = false
		simulation.isDead = false
		simulation.isTesting = false
		simulation.startTime = now()
		simulation.timeOffset = now()
		simulation.time = 0
		dc.style.display = 'block'
		main.style.display = 'none'
		document.title = 'Tetragon: Main Menu'
		hud.Obj.style.display = 'none'
		pauseScreen.style.display = 'none'
	},

	get defaults() {
		return { pressedKeys: [] }
	},

	set defaults(val) { throw new Error('input.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},

	respawn() {
		if (
			!simulation.isPaused &&
			!simulation.isChoosing &&
			!simulation.isDead &&
			!simulation.isMainMenu
		) return undefined

		simulation.wipe()
		simulation.isMainMenu = false

		hud.Obj.style.display = 'block'
		dc.style.display = 'none'
		main.style.display = 'block'
		document.title = 'Tetragon'
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
				case this.keybinds.testing:
					this.testing()
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
		if (!simulation.isPaused && !simulation.isChoosing) {
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

			// Normalize and apply movement
			const magnitude = Math.sqrt(moveX * moveX + moveY * moveY)
			if (magnitude > 0) {
				// Use magnitude to prevent faster diagonal movement and allow for analog stick sensitivity
				const normalizedX = moveX / magnitude
				const normalizedY = moveY / magnitude
				state.player.pos.x += normalizedX * state.player.velocity * Math.min(1, magnitude)
				state.player.pos.y += normalizedY * state.player.velocity * Math.min(1, magnitude)
			}
		}
		this.pressedKeys.forEach(function (k) {
			switch (k) {
				case this.keybinds.fire:
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
}

//actually handling input
window.addEventListener("resize", function (r) {
	main.width = window.innerWidth
	main.height = window.innerHeight
	collisions.border.right = main.width - state.player.size / 2
	collisions.border.bottom = main.height - state.player.size / 2
	draw.clearRect(0, 0, main.width, main.height)
}.bind(this))
main.addEventListener("contextmenu", function (cxm) {
	cxm.preventDefault()
	input.rightClick()
}.bind(this))
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
}.bind(this))
main.addEventListener("mousemove", function (m) {
	input.cursor.update(m.offsetX, m.offsetY)
}.bind(this))
document.addEventListener("keydown", function (k) {
	if (input.preventDefaultList.includes(k.code)) k.preventDefault()
	if (input.pressedKeys.includes(k.code)) return undefined
	input.pressedKeys.push(k.code)
	input.lilKeyLogic()
}.bind(this))
document.addEventListener("keyup", function (k) {
	if (input.pressedKeys.includes(k.code)) input.pressedKeys = input.pressedKeys.filter(function (key) { return key != k.code }.bind(this))
	input.lilKeyLogic()
}.bind(this))
