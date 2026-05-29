var hud = {
	Obj: document.getElementById('HUD'),
	health: document.getElementById('health-bar'),
	maxHealth: document.getElementById('max-health'),
	upgrades: document.getElementById('upgrade-list'),
	inv: document.getElementById('inventory'),
	levels: document.getElementById('level-counter'),
	timer: document.getElementById('timer'),
	_timeMessage: ``,
	get timeMessage() { return this._timeMessage },
	set timeMessage(val) { this._timeMessage = val },

	criticalOverlay: document.createElement('div'),
	debugBadge: document.createElement('div'),
	_displayHealth: 100,
	get displayHealth() { return this._displayHealth },
	set displayHealth(val) { this._displayHealth = val },

	_displayMaxHealth: 100,
	get displayMaxHealth() { return this._displayMaxHealth },
	set displayMaxHealth(val) { this._displayMaxHealth = val },

	showMobileMenu: true,

	get defaults() {
		return {
			displayHealth: 100,
			displayMaxHealth: 100,
			timeMessage: '',
			showMobileMenu: true
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
		const ts = simulation.timeScale
		// Correct frame-independent lerp formula
		this.displayHealth = lerp(this.displayHealth, state.player.health, 1 - Math.pow(1 - 0.1, ts))
		this.displayMaxHealth = lerp(this.displayMaxHealth, state.player.maxHealth, 1 - Math.pow(1 - 0.1, ts))
		this.health.style.width = `${this.displayHealth * 2}px`
		this.health.style.backgroundColor = `hsl(${(this.displayHealth / this.displayMaxHealth) * 115}, 100%, 50%)`
		// this.maxHealth.style.backgroundColor = `hsla(${(this.displayHealth / this.displayMaxHealth) * 115}, 100%, 50%, 0.3)`
		this.health.innerText = `${Math.round(state.player.health * 1000) / 1000}`
		this.maxHealth.style.width = `${this.displayMaxHealth * 2}px`
	},
	upgradeList() {
		if (simulation.isMobile && !this.showMobileMenu) {
			this.upgrades.style.display = 'none'
			return
		}
		this.upgrades.style.display = 'block'
		this.upgrades.style.position = 'absolute'
		this.upgrades.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
		this.upgrades.style.width = simulation.isMobile ? '120px' : '180px'
		upgrades.uniqueCollected = [...new Set(upgrades.collected)]
		this.upgrades.style.height = `${upgrades.uniqueCollected.length * 50}px`
		this.upgrades.style.right = '2vw'
		this.upgrades.style.top = '0px'
		this.upgrades.style.color = 'black'
		this.upgrades.style.fontSize = simulation.isMobile ? '12px' : '15px'
		this.upgrades.style.textAlign = 'left'
		this.upgrades.innerHTML = `
		${upgrades.uniqueCollected.map(function (upg) {
			return countOccurrences(upgrades.collected, upg) > 1 ? `${upg.name} (${countOccurrences(upgrades.collected, upg)})` : `${upg.name}`
		}).join(`<br/>`)}`
	},
	inventory() {
		if (simulation.isMobile && !this.showMobileMenu) {
			this.inv.style.display = 'none'
			return
		}
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
		${guns.inventory.map((g) => g.HUDEntry
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

		this.levels.style.width = simulation.isMobile ? '140px' : '200px'
		this.levels.style.height = '50px'
		this.levels.style.textAlign = 'center'
		this.levels.style.left = '50%'
		this.levels.style.transform = 'translateX(-50%)'
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
	debugIndicator() {
		if (simulation.isDebug) {
			this.debugBadge.style.display = 'block'
		} else {
			this.debugBadge.style.display = 'none'
		}
	},
	make() {
		this.timeMessage = this.processTime()
		this.healthBar()
		this.inventory()
		this.levelCounter()
		this.upgradeList()
		this.criticalHealth()
		this.debugIndicator()
	}
}

hud.Obj.style.pointerEvents = 'none'
hud.health.style.pointerEvents = 'auto'
hud.inv.style.pointerEvents = 'auto'
hud.levels.style.pointerEvents = 'auto'
hud.upgrades.style.pointerEvents = 'auto'
hud.criticalOverlay.style.pointerEvents = 'none'

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

hud.debugBadge.id = 'debug-badge'
hud.debugBadge.innerText = 'DEBUG'
hud.debugBadge.style.pointerEvents = 'none'
hud.Obj.appendChild(hud.debugBadge)

hud.health.addEventListener('mousemove', (m) => {
	input.cursor.update(m.offsetX + hud.health.offsetLeft, m.offsetY + hud.health.offsetTop)
})
hud.inv.addEventListener('mousemove', (m) => {
	input.cursor.update(m.offsetX + hud.inv.offsetLeft, m.offsetY + hud.inv.offsetTop)
})
hud.levels.addEventListener('mousemove', (m) => {
	input.cursor.update(m.offsetX + hud.levels.offsetLeft, m.offsetY + hud.levels.offsetTop)
})
hud.upgrades.addEventListener('mousemove', (m) => {
	input.cursor.update(m.offsetX + hud.upgrades.offsetLeft, m.offsetY + hud.upgrades.offsetTop)
})
