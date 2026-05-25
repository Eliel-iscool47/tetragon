var hud = {
	Obj: document.getElementById('HUD'),
	health: document.getElementById('health-bar'),
	maxHealth: document.getElementById('max-health'),
	upgrades: document.getElementById('upgrade-list'),
	inv: document.getElementById('inventory'),
	levels: document.getElementById('level-counter'),
	timer: document.getElementById('timer'),
	inGameConsole: document.getElementById('console'),
	_timeMessage: ``,
	get timeMessage() { return this._timeMessage },
	set timeMessage(val) { this._timeMessage = val },

	criticalOverlay: document.createElement('div'),
	_displayHealth: 100,
	get displayHealth() { return this._displayHealth },
	set displayHealth(val) { this._displayHealth = val },

	_displayMaxHealth: 100,
	get displayMaxHealth() { return this._displayMaxHealth },
	set displayMaxHealth(val) { this._displayMaxHealth = val },

	get defaults() {
		return {
			displayHealth: 100,
			displayMaxHealth: 100,
			timeMessage: ''
		}
	},

	set defaults(val) { throw new Error('hud.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	processTime() {
		switch (true) {
			case simulation.time < 60:
				return `${round(simulation.time, 1)}s`
				break
			case simulation.time < 3600:
				return `${Math.floor(simulation.time / 60)}m ${round(simulation.time % 60, 1)}s`
				break
			default:
				return `${Math.floor(simulation.time / 3600)}h ${Math.floor((simulation.time % 3600) / 60)}m ${round(simulation.time % 60, 1)}s`
				break
		}
	},
	healthBar() {
		this.displayHealth = lerp(this.displayHealth, state.player.health, 0.1)
		this.displayMaxHealth = lerp(this.displayMaxHealth, state.player.maxHealth, 0.1)
		this.health.style.width = `${this.displayHealth * 2}px`
		this.health.style.backgroundColor = `hsl(${(this.displayHealth / this.displayMaxHealth) * 115}, 100%, 50%)`
		// this.maxHealth.style.backgroundColor = `hsla(${(this.displayHealth / this.displayMaxHealth) * 115}, 100%, 50%, 0.3)`
		this.health.innerText = `${Math.round(state.player.health * 1000) / 1000}`
		this.maxHealth.style.width = `${this.displayMaxHealth * 2}px`
	},
	upgradeList() {
		this.upgrades.style.display = 'block'
		this.upgrades.style.position = 'absolute'
		this.upgrades.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
		this.upgrades.style.width = `${main.width * 0.125}px`
		upgrades.uniqueCollected = [...new Set(upgrades.collected)]
		this.upgrades.style.height = `${upgrades.uniqueCollected.length * 50}px`
		this.upgrades.style.left = `${main.width - 25 - parseFloat(this.upgrades.style.width)}px`
		this.upgrades.style.top = '0px'
		this.upgrades.style.color = 'black'
		this.upgrades.style.fontSize = '15px'
		this.upgrades.style.textAlign = 'left'
		this.upgrades.innerHTML = `
		${upgrades.uniqueCollected.map(function (upg) {
			return countOccurrences(upgrades.collected, upg) > 1 ? `${upg.name} (${countOccurrences(upgrades.collected, upg)})` : `${upg.name}`
		}.bind(this)).join('<br>')}
		`
	},
	console() {
		this.inGameConsole.style.display = 'block'
		this.inGameConsole.style.backgroundColor = 'hsla(0, 0%, 60%, 0.65)'
		this.inGameConsole.style.width = `300px`
		this.inGameConsole.style.height = `fit-content`
		this.inGameConsole.style.maxHeight = `220px`
		this.inGameConsole.style.overflowY = `scroll`
		this.inGameConsole.style.left = `0px`
		this.inGameConsole.style.top = `${main.height - parseFloat(this.inGameConsole.style.maxHeight)}px`
		this.inGameConsole.style.color = 'black'
		this.inGameConsole.style.textAlign = 'left'
		this.inGameConsole.style.fontSize = '15px'
		this.inGameConsole.innerHTML = `
		Console:
		${simulation.consoleMessage}
		`
	},
	inventory() {
		this.inv.style.display = 'block'
		this.inv.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
		this.inv.style.width = '320px'
		this.inv.style.margin = '0'
		this.inv.style.padding = '0'
		this.inv.style.height = `${guns.inventory.length * 40 + 55}px`
		this.inv.style.color = 'black'
		this.inv.style.fontSize = '24px'
		this.inv.style.textAlign = 'left'
		this.inv.innerHTML = `
		Inventory: <br>
		${guns.inventory.map(function (g) {
			return g.HUDEntry
		}.bind(this)
		).join('').replaceAll('Infinity', '∞')}
		`
	},
	levelCounter() {
		const remaining = level.intermission - (simulation.time - level.time)
		const isIntermission = state.level.isWon()

		if (isIntermission && remaining < 3 && remaining > 0) {
			// Pulse red with high frequency to indicate urgency
			const pulse = 0.5 + 0.5 * Math.sin(simulation.time * 20)
			this.levels.style.backgroundColor = `hsla(0, 100%, 50%, ${0.4 + pulse * 0.4})`
			this.levels.style.color = 'white'
		} else {
			this.levels.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
			this.levels.style.color = 'black'
		}

		this.levels.style.width = '180px'
		this.levels.style.height = '50px'
		this.levels.style.textAlign = 'center'
		this.levels.style.left = `${(main.width * 0.5) - 200}px`
		this.levels.style.top = '0'
		this.levels.innerText = (!isIntermission ? `Level ${level.current}` : `Level ${level.current + 1} in ${round(remaining, 1)}s`) +
			`\n${this.timeMessage}`
	},
	criticalHealth() {
		if (state.player.health / state.player.maxHealth <= 0.3 && !simulation.isDead) {
			this.criticalOverlay.style.display = 'block'
			this.criticalOverlay.style.opacity = `${(1 - (state.player.health / (state.player.maxHealth * 0.3))) * (0.5 + 0.5 * Math.sin(simulation.time * 10))}`
		} else this.criticalOverlay.style.display = 'none'
	},
	make() {
		this.timeMessage = this.processTime()
		this.healthBar()
		this.inventory()
		this.levelCounter()
		this.console()
		this.upgradeList()
		this.criticalHealth()
	}
}

hud.Obj.appendChild(hud.health)
hud.Obj.appendChild(hud.inv)
hud.Obj.appendChild(hud.levels)
hud.Obj.appendChild(hud.upgrades)
hud.criticalOverlay.style.position = 'fixed'
hud.criticalOverlay.style.top = '0'
hud.criticalOverlay.style.left = '0'
hud.criticalOverlay.style.width = '100vw'
hud.criticalOverlay.style.height = '100vh'
hud.criticalOverlay.style.pointerEvents = 'none'
hud.criticalOverlay.style.boxShadow = 'inset 0 0 150px red'
hud.criticalOverlay.style.zIndex = '-1'
hud.Obj.appendChild(hud.criticalOverlay)
hud.health.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.health.offsetLeft, m.offsetY + hud.health.offsetTop)
}.bind(this))
hud.inv.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.inv.offsetLeft, m.offsetY + hud.inv.offsetTop)
}.bind(this))
hud.levels.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.levels.offsetLeft, m.offsetY + hud.levels.offsetTop)
}.bind(this))
hud.upgrades.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.upgrades.offsetLeft, m.offsetY + hud.upgrades.offsetTop)
}.bind(this))
hud.inGameConsole.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.inGameConsole.offsetLeft, m.offsetY + hud.inGameConsole.offsetTop)
}.bind(this))