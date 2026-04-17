const hud = {
	Obj: document.getElementById('HUD'),
	health: document.getElementById('health-bar'),
	maxHealth: document.getElementById('max-health'),
	damageTaken: document.getElementById('damage-taken-bar'),
	damage: document.getElementById('damage-bar'),
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

	_displayDmg: 1,
	get displayDmg() { return this._displayDmg },
	set displayDmg(val) { this._displayDmg = val },

	_displayDefense: 1,
	get displayDefense() { return this._displayDefense },
	set displayDefense(val) { this._displayDefense = val },

	healthBar() {
		this.displayHealth = lerp(this.displayHealth, player.health, 0.1)
		this.displayMaxHealth = lerp(this.displayMaxHealth, player.maxHealth, 0.1)
		this.health.style.width = `${this.displayHealth * 2}px`
		this.health.style.backgroundColor = `hsl(${(this.displayHealth / this.displayMaxHealth) * 115}, 100%, 50%)`
		this.health.innerText = `${Math.round(player.health * 1000) / 1000}`
		this.maxHealth.style.width = `${this.displayMaxHealth * 2}px`
	},
	damageTakenBar() {
		this.displayDefense = lerp(this.displayDefense, player.damageTaken, 0.1)
		if (this.displayDefense <= 1) {
			this.damageTaken.style.backgroundColor = 'hsl(190, 100%, 75%)'
			this.damageTaken.style.width = `${(1 - this.displayDefense) * this.displayMaxHealth * 2}px`
		}
		else {
			this.damageTaken.style.backgroundColor = 'hsl(0, 100%, 70%)'
			this.damageTaken.style.width = `${(this.displayDefense - 1) * this.displayMaxHealth * 2}px`
		}
	},
	damageBar() {
		this.displayDmg = lerp(this.displayDmg, player.damageDone, 0.1)
		this.damage.style.height = `${this.displayDmg * 200}px`
		this.damage.style.backgroundColor = 'hsl(0, 100%, 35%)'
		this.damage.innerText = `${Math.round(player.damageDone * 1000) / 1000}`
		this.damage.style.color = 'hsl(0, 0%, 100%)'
		this.damage.style.textAlign = 'center'
		this.damage.style.fontSize = '20px'
		this.damage.style.position = 'absolute'
		this.damage.style.left = `${main.width - 25}px`
		this.damage.style.width = `${main.width - parseFloat(this.damage.style.left)}px`
		this.damage.style.top = '0'
	},
	upgradeList() {
		this.upgrades.style.display = 'block'
		this.upgrades.style.position = 'absolute'
		this.upgrades.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
		this.upgrades.style.width = `${main.width * 0.125}px`
		upgrades.uniqueCollected = [...new Set(upgrades.collected)]
		this.upgrades.style.height = `${upgrades.uniqueCollected.length * 50}px`
		this.upgrades.style.left = `${parseFloat(this.damage.style.left) - parseFloat(this.upgrades.style.width)}px`
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
		)
				.join('<br>').replaceAll('Infinity', '∞')}
		`
	},
	levelCounter() {
		this.levels.style.backgroundColor = 'hsla(0, 0%, 70%, 0.65)'
		this.levels.style.width = '180px'
		this.levels.style.height = '50px'
		this.levels.style.color = 'black'
		// this.levels.style.font = '20px Consolas'
		this.levels.style.textAlign = 'center'
		this.levels.style.left = `${(main.width * 0.5) - 200}px`
		this.levels.style.top = '0'
		switch (true) {
			case simulation.time < 60:
				this.timeMessage = `${simulation.time.toFixed(1)}s`
				break
			case simulation.time < 3600:
				this.timeMessage = `${Math.floor(simulation.time / 60)}m ${(simulation.time % 60).toFixed(1)}s`
				break
			default:
				this.timeMessage = `${Math.floor(simulation.time / 3600)}h ${Math.floor((simulation.time % 3600) / 1)}m ${Math.round(simulation.time % 60)}s`
				break
		}
		this.levels.innerText = (mobs.list.some(m => m.class == 'boss') ? `Level ${level.current}` : `Level ${level.current + 1} in ${level.intermission - Math.round(simulation.time - level.time)}s`) +
			`\n${this.timeMessage}`
	},
	elapsedTime() {
		this.timer.style.top = `${main.height - 50}px`
		this.timer.style.left = '0'
		this.timer.style.width = '180px'
		this.timer.style.height = '50px'
		this.timer.style.backgroundColor = 'hsla(0, 0%, 55%, 0.65)'
		this.timer.style.color = 'black'
		this.timer.style.fontSize = '20px'
		this.timer.style.textAlign = 'left'
		switch (true) {
			case simulation.time < 60:
				this.timeMessage = `${simulation.time.toFixed(1)}s`
				break
			case simulation.time < 3600:
				this.timeMessage = `${Math.floor(simulation.time / 60)}m ${(simulation.time % 60).toFixed(1)}s`
				break
			default:
				this.timeMessage = `${Math.floor(simulation.time / 3600)}h ${Math.floor((simulation.time % 3600) / 1)}m ${Math.round(simulation.time % 60)}s`
				break
		}
		this.timer.innerText = this.timeMessage
	},
	criticalHealth() {
		if (player.health / player.maxHealth <= 0.3 && !simulation.isDead) {
			this.criticalOverlay.style.display = 'block'
			this.criticalOverlay.style.opacity = `${(1 - (player.health / (player.maxHealth * 0.3))) * (0.5 + 0.5 * Math.sin(simulation.time * 10))}`
		} else this.criticalOverlay.style.display = 'none'
	},
	make() {
		this.healthBar()
		this.damageTakenBar()
		this.damageBar()
		this.inventory()
		this.levelCounter()
		this.console()
		this.upgradeList()
		this.criticalHealth()
	}
}
hud.Obj.appendChild(hud.health)
hud.Obj.appendChild(hud.inv)
hud.Obj.appendChild(hud.damageTaken)
hud.Obj.appendChild(hud.damage)
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
hud.damageTaken.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.damageTaken.offsetLeft, m.offsetY + hud.damageTaken.offsetTop)
}.bind(this))
hud.damage.addEventListener('mousemove', function (m) {
	input.cursor.update(m.offsetX + hud.damage.offsetLeft, m.offsetY + hud.damage.offsetTop)
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