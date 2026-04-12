const upgrades = {
	_ammoYield: 1,
	get ammoYield() { return this._ammoYield },
	set ammoYield(val) { this._ammoYield = val },

	_fireRate: 1,
	get fireRate() { return this._fireRate },
	set fireRate(val) { this._fireRate = val },

	_rerolls: 0,
	get rerolls() { return this._rerolls },
	set rerolls(val) { this._rerolls = val },

	_optionsPerPowerUp: 3,
	get optionsPerPowerUp() { return this._optionsPerPowerUp },
	set optionsPerPowerUp(val) { this._optionsPerPowerUp = val },

	_healEffect: 1,
	get healEffect() { return this._healEffect },
	set healEffect(val) { this._healEffect = val },

	_powerUpSpawnChance: 1,
	get powerUpSpawnChance() { return this._powerUpSpawnChance },
	set powerUpSpawnChance(val) { this._powerUpSpawnChance = val },

	_missilesPerShot: 1,
	get missilesPerShot() { return this._missilesPerShot },
	set missilesPerShot(val) { this._missilesPerShot = val },

	_isExplosionColorful: false,
	get isExplosionColorful() { return this._isExplosionColorful },
	set isExplosionColorful(val) { this._isExplosionColorful = val },

	_isHealthRegen: false,
	get isHealthRegen() { return this._isHealthRegen },
	set isHealthRegen(val) { this._isHealthRegen = val },

	_isBulletExplode: false,
	get isBulletExplode() { return this._isBulletExplode },
	set isBulletExplode(val) { this._isBulletExplode = val },

	isKillDefense: false,
	bulletExplosionTypes: [
		'shotgun',
		'rifle',
		'smg',
		'bouncy balls',
	],
	lastKill: (-10) ** 299,
	lastHealthRegen: (-10) ** 299,
	regenAmount: 1,
	regenSpeed: 1,
	collected: [],
	uniqueCollected: [],
	options: [],
	unlocked: [],
	defaultPool: [
		'militarism',
		'reactiveArmor',
		'liquidCooling',
		'strengthenedAlloys',
		'maintenance',
		'lucky',
		'logistics',
		'regeneration',
	],
	pool: [],
	randomizeOptions() {
		this.options = []
		const tempPool = [...this.pool]
		repeat(function () {
			if (tempPool.length <= 0) return undefined
			const r = randInt(0, tempPool.length - 1)
			const key = tempPool.at(r)
			this.options.push(this[key])
			tempPool.splice(r, 1)
		}.bind(this), this.optionsPerPowerUp)
	},
	/**
	 * This method shows the choice menu to choose an upgrade.
	 */
	choose() {
		this.check()
		if (this.pool.length <= 0) return undefined
		if (!simulation.isChoosing) simulation.isChoosing = true
		buttons.currentChoose = this
		chooseScreen.style.display = 'block'
		chooseScreen.style.width = `${main.width}px`
		chooseScreen.style.height = `${main.height}px`
		chooseScreen.style.margin = '0'
		chooseScreen.style.padding = '0'
		chooseScreen.style.color = 'white'
		chooseScreen.style.textAlign = 'center'
		chooseScreen.style.overflowY = 'scroll'
		chooseScreen.style.overflowX = 'scroll'
		chooseScreen.style.position = 'fixed'
		this.randomizeOptions()
		chooseScreen.innerHTML = `
		<br>
		Choose an upgrade:
		<br>
		${Math.ceil(this.rerolls - 0.5) > 0 ? buttons.rerollButton() : ''}
		${buttons.cancel}
			<br><br>
		${this.options.filter(function (u) { return u != undefined }.bind(this)).map(function (upg) {
			return `<button class="upgrade-button"
			style="
			width: ${parseFloat(chooseScreen.style.width) * 0.6}px; 
			height: ${parseFloat(chooseScreen.style.height) / Math.floor(this.optionsPerPowerUp * 1.5) + 50}px; 
			left: 100px;
			top: ${(this.options.indexOf(upg) * 1.1 * parseFloat(chooseScreen.style.height) / this.optionsPerPowerUp) + 200}px;
			" 
			onclick='upgrades.get("${upg.id}"); simulation.isChoosing = false;'>${upg.name}:<br>
		${upg.description}</button>`
		}.bind(this)).join('<br>')}
		`
	},
	apply() {
		this.collected.at(-1).effect()
	},
	check() {
		this.unlocked = [...new Set(this.unlocked)]
		const counts = {}
		this.collected.forEach(function (upg) {
			counts[upg.id] = (counts[upg.id] || 0) + 1
		}.bind(this))
		this.pool = this.pool.filter(function (id) { return (counts[id] || 0) < this[id].stackSize }.bind(this))
		if (this.unlocked.includes('explosions')) {
			if (!this.pool.includes('pyrotechnics') && (counts['pyrotechnics'] || 0) < this.pyrotechnics.stackSize) {
				this.pool.push('pyrotechnics')
			}
			if (!this.pool.includes('nitroglycerin') && (counts['nitroglycerin'] || 0) < this.nitroglycerin.stackSize) this.pool.push('nitroglycerin')
		}
		if (this.unlocked.includes('missiles')) {
			if (!this.pool.includes('MIRV') && (counts['MIRV'] || 0) < this.MIRV.stackSize) this.pool.push('MIRV')
		}
		if (this.unlocked.includes('grenades')) {
			/* grenade upgrades soon */
		}
		if (this.unlocked.includes('shotgun')) {
			if (!this.pool.includes('incendiaryMunitions') && (counts['incendiaryMunitions'] || 0) < this.incendiaryMunitions.stackSize) {
				this.pool.push('incendiaryMunitions')
			}
		}
		if (this.unlocked.includes('sniper')) {
			/* sniper upgrades soon */
		}
		if (this.unlocked.includes('rifle')) {
			if (!this.pool.includes('incendiaryMunitions') && (counts['incendiaryMunitions'] || 0) < this.incendiaryMunitions.stackSize) {
				this.pool.push('incendiaryMunitions')
			}
		}
		if (this.unlocked.includes('smg')) {
			if (!this.pool.includes('incendiaryMunitions') && (counts['incendiaryMunitions'] || 0) < this.incendiaryMunitions.stackSize) {
				this.pool.push('incendiaryMunitions')
			}
		}
		if (this.unlocked.includes('minigun')) {
			/* minigun upgrades soon */
		}
		if (this.unlocked.includes('bouncy balls')) {
			if (!this.pool.includes('incendiaryMunitions') && (counts['incendiaryMunitions'] || 0) < this.incendiaryMunitions.stackSize) {
				this.pool.push('incendiaryMunitions')
			}
		}
		if (this.unlocked.includes('flamethrower') || this.unlocked.includes('flames')) {
			/* flamethrower upgrades soon */
		}
		if (this.unlocked.includes('laser')) {
			/* laser upgrades soon */
		}
		if (this.unlocked.includes('pistol')) {
			/* pistol upgrades soon */
		}
		if (this.unlocked.includes('regen') || this.isHealthRegen) {
			if (!this.pool.includes('acceleratedHealing') && (counts['acceleratedHealing'] || 0) < this.acceleratedHealing.stackSize) {
				this.pool.push('acceleratedHealing')
			}
		}
		if (this.unlocked.includes('bullets')) {
			/* bullet upgrades soon */
		}
	},
	get(name) {
		this.collected.push(this[name])
		this.apply()
	},
	applyRegen() {
		if (
			this.isHealthRegen &&
			simulation.time - this.lastHealthRegen >= 1 / this.regenSpeed &&
			player.health < player.maxHealth
		) {
			player.health += this.regenAmount * this.healEffect
			this.lastHealthRegen = simulation.time
		}
	},
	militarism: {
		id: 'militarism',
		name: 'Militarism',
		stackSize: 5,
		description: `1.3x ${text.damage}`,
		effect() {
			player.damageDone *= 1.3
		}
	},
	reactiveArmor: {
		id: 'reactiveArmor',
		name: 'Reactive Armor',
		stackSize: 5,
		description: `0.65x ${text.damageTaken}`,
		effect() {
			player.damageTaken *= 0.65
		}
	},
	liquidCooling: {
		id: 'liquidCooling',
		name: 'Liquid Cooling',
		stackSize: 1,
		description: '1.35x movement speed and 2x fire rate',
		effect() {
			player.velocity *= 1.35
			upgrades.fireRate *= 2
		}
	},
	strengthenedAlloys: {
		id: 'strengthenedAlloys',
		name: 'Strengthened Alloys',
		stackSize: 3,
		description: `1.2x ${text.maxHealth}`,
		effect() {
			player.maxHealth *= 1.2
		}
	},
	maintenance: {
		id: 'maintenance',
		name: 'Maintenance',
		stackSize: 5,
		description: `1.3x health per ${text.heal}`,
		effect() {
			upgrades.healEffect *= 1.3
		}
	},
	regeneration: {
		id: 'regeneration',
		name: 'Regeneration',
		stackSize: 1,
		description: `Regenerate over time based on ${text.heal} effect`,
		effect() {
			upgrades.isHealthRegen = true
			upgrades.unlocked.push('regen')
			upgrades.lastHealthRegen = simulation.time
		}
	},
	acceleratedHealing: {
		id: 'acceleratedHealing',
		name: 'Accelerated Healing',
		stackSize: 3,
		description: `1.5x ${text.health} regeneration speed`,
		effect() {
			upgrades.regenSpeed *= 1.5
		}
	},
	lucky: {
		id: 'lucky',
		name: 'Lucky',
		stackSize: 5,
		description: `1.5x power-up spawn chance`,
		effect() {
			upgrades.powerUpSpawnChance *= 1.5
		}
	},
	logistics: {
		id: 'logistics',
		name: 'Logistics',
		stackSize: 2,
		description: `3x <span class="styled-text ammo">ammo yield</span>`,
		effect() {
			upgrades.ammoYield *= 3
		}
	},
	pyrotechnics: {
		id: 'pyrotechnics',
		name: 'Pyrotechnics',
		stackSize: 1,
		description: `1.2x ${text.explosionDamage} and <span class="styled-text explosion">size</span> <br> <span class="styled-text explosion">Explosions</span> are colorful.`,
		effect() {
			bullets.explosions.damageDone *= 1.2
			bullets.explosions.size *= 1.2
			upgrades.isExplosionColorful = true
		}
	},
	incendiaryMunitions: {
		id: 'incendiaryMunitions',
		name: 'Incendiary Munitions',
		stackSize: 1,
		description: 'Shotgun pellets, Bouncy Balls, SMG bullets, and Rifle bullets <span class="styled-text explosion">explode</span> upon contact',
		effect() {
			upgrades.isBulletExplode = true
			upgrades.unlocked.push('explosions')
		}
	},
	nitroglycerin: {
		id: 'nitroglycerin',
		name: 'Nitroglycerin',
		stackSize: 3,
		description: `2x ${text.explosionDamage}<br>0.8x <span class="styled-text explosion">explosion size</span>`,
		effect() {
			bullets.explosions.damageDone *= 2
			bullets.explosions.size *= 0.8
		}
	},
	MIRV: {
		id: 'MIRV',
		name: 'MIRV',
		stackSize: 10,
		description: `Shoot an extra <span class="styled-text gun">missile</span> per shot<br>0.9x <span class="styled-text gun">missile</span> <span class="styled-text explosion">explosion damage</span> and <span class="styled-text explosion">explosion size</span>`,
		effect() {
			upgrades.missilesPerShot++
			bullets.explosions.damageDone *= 0.9
			bullets.explosions.size *= 0.9
		}
	},

}
upgrades.pool = [...upgrades.defaultPool]