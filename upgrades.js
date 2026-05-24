var upgrades = {
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

	_invulnerabilityDuration: 1,
	get invulnerabilityDuration() { return this._invulnerabilityDuration },
	set invulnerabilityDuration(val) { this._invulnerabilityDuration = val },

	_shieldEffect: 1,
	get shieldEffect() { return this._shieldEffect },
	set shieldEffect(val) { this._shieldEffect = val },

	_reloadSpeed: 1,
	get reloadSpeed() { return this._reloadSpeed },
	set reloadSpeed(val) { this._reloadSpeed = val },

	_missilesPerShot: 1,
	get missilesPerShot() { return this._missilesPerShot },
	set missilesPerShot(val) { this._missilesPerShot = val },

	_shotgunPellets: 10,
	get shotgunPellets() { return this._shotgunPellets },
	set shotgunPellets(val) { this._shotgunPellets = val },

	_isExplosionColorful: false,
	get isExplosionColorful() { return this._isExplosionColorful },
	set isExplosionColorful(val) { this._isExplosionColorful = !!val },

	_isHealthRegen: false,
	get isHealthRegen() { return this._isHealthRegen },
	set isHealthRegen(val) { this._isHealthRegen = !!val },

	_isBulletExplode: false,
	get isBulletExplode() { return this._isBulletExplode },
	set isBulletExplode(val) { this._isBulletExplode = !!val },

	_magnetRange: 100,
	get magnetRange() { return this._magnetRange },
	set magnetRange(val) { this._magnetRange = val },

	_magnetStrength: 1,
	get magnetStrength() { return this._magnetStrength },
	set magnetStrength(val) { this._magnetStrength = val },

	_isKillDefense: false,
	get isKillDefense() { return this._isKillDefense },
	set isKillDefense(val) { this._isKillDefense = !!val },

	_isVampire: false,
	get isVampire() { return this._isVampire },
	set isVampire(val) { this._isVampire = !!val },

	_vampireHealAmmount: 0.1,
	get vampireHealAmmount() { return this._vampireHealAmmount },
	set vampireHealAmmount(val) { this._vampireHealAmmount = val },

	_knifeRange: 1,
	get knifeRange() { return this._knifeRange },
	set knifeRange(val) { this._knifeRange = val },

	_knifeDuration: 0.3,
	get knifeDuration() { return this._knifeDuration },
	set knifeDuration(val) { this._knifeDuration = val },

	_missileExplosionDamage: 1,
	get missileExplosionDamage() { return this._missileExplosionDamage },
	set missileExplosionDamage(val) { this._missileExplosionDamage = val },

	_missileExplosionSize: 1,
	get missileExplosionSize() { return this._missileExplosionSize },
	set missileExplosionSize(val) { this._missileExplosionSize = val },

	_grenadeExplosionDamage: 1,
	get grenadeExplosionDamage() { return this._grenadeExplosionDamage },
	set grenadeExplosionDamage(val) { this._grenadeExplosionDamage = val },

	_grenadeExplosionSize: 1,
	get grenadeExplosionSize() { return this._grenadeExplosionSize },
	set grenadeExplosionSize(val) { this._grenadeExplosionSize = val },

	_critChance: 0.05,
	get critChance() { return this._critChance },
	set critChance(val) { this._critChance = val },

	_critMultiplier: 2,
	get critMultiplier() { return this._critMultiplier },
	set critMultiplier(val) { this._critMultiplier = val },

	_shieldMultiplier: 1,
	get shieldMultiplier() { return this._shieldMultiplier },
	set shieldMultiplier(val) { this._shieldMultiplier = val },

	_isClusterBomb: false,
	get isClusterBomb() { return this._isClusterBomb },
	set isClusterBomb(val) { this._isClusterBomb = !!val },

	_clusterBombCount: 0,
	get clusterBombCount() { return this._clusterBombCount },
	set clusterBombCount(val) { this._clusterBombCount = val },

	_isNapalm: false,
	get isNapalm() { return this._isNapalm },
	set isNapalm(val) { this._isNapalm = !!val },

	clusterBombTypes: [
		'missiles',
		'grenadeLauncher',
	],

	bulletExplosionTypes: [
		'shotgun',
		'rifle',
		'smg',
		'bouncy balls',
		'missiles',
		'grenadeLauncher',
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
		'looting',
		'logistics',
		'regeneration',
		'heavyCaliber',
		'energyShield',
		'speedLoader',
		'deadlyAim',
		'powerSurge',
		'vampirism',
		'ironWill',
		'reinforcedShields',
		'lightCaliber',
	],
	Upgrade: class {
		constructor(config) {
			this.id = config.id
			this.name = config.name
			this.stackSize = config.stackSize || 1
			this.description = config.description
			this.effect = config.effect
			this.requirements = config.requirements || (() => true)
		}
	},
	pool: [],
	randomizeOptions() {
		this.options = []
		let tempPool = [...this.pool]
		const amount = Math.min(this.optionsPerPowerUp, tempPool.length)

		repeat(function () {
			if (tempPool.length <= 0) return undefined
			const r = randInt(0, tempPool.length - 1)
			const key = tempPool.at(r)
			const upg = this[key]
			if (upg) this.options.push(upg)
			tempPool = tempPool.filter((_, j) => j !== r)
		}.bind(this), amount)
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

		// Filter out upgrades that have reached their stack limit from the pool
		this.pool = this.pool.filter(id => (counts[id] || 0) < (this[id]?.stackSize ?? Infinity))

		// Add new upgrades to the pool if their requirements are met
		// Iterate over all possible upgrade IDs (from defaultPool and any others that might be added conditionally)
		const allUpgradeIds = [
			...this.defaultPool,
			'pyrotechnics',
			'nitroglycerin',
			'MIRV',
			'incendiaryMunitions',
			'acceleratedHealing',
			'napalm',
			'tacticalEfficiency',
			'clusterBomb',
			'sharpenedEdge',
			'leadStorm',
			'deadEye',
			'highCapMags',
			'internalCooling',
			'superball',
			'refractiveLens',
			'lightCaliber',
			// Add any other upgrade IDs that might become available conditionally
		]

		allUpgradeIds.forEach(id => {
			const upg = this[id]
			if (upg && !this.pool.includes(id) && (counts[id] || 0) < (upg.stackSize ?? Infinity)) {
				if (upg.requirements()) {
					this.pool.push(id)
				}
			}
		})
	},

	get defaults() {
		return {
			_ammoYield: 1,
			_fireRate: 1,
			_rerolls: 0,
			_optionsPerPowerUp: 3,
			_healEffect: 1,
			_powerUpSpawnChance: 1,
			_reloadSpeed: 1,
			_invulnerabilityDuration: 1,
			_shieldEffect: 1,
			_missilesPerShot: 1,
			_shotgunPellets: 10,
			_isExplosionColorful: false,
			_isHealthRegen: false,
			_isBulletExplode: false,
			_magnetRange: 100,
			_magnetStrength: 1,
			_isNapalm: false,
			_isClusterBomb: false,
			_clusterBombCount: 0,
			_isVampire: false,
			_vampireHealAmmount: 0.1,
			_knifeRange: 1,
			_knifeDuration: 0.3,
			_missileExplosionDamage: 1,
			_missileExplosionSize: 1,
			_grenadeExplosionDamage: 1,
			_grenadeExplosionSize: 1,
			_critChance: 0.05,
			_critMultiplier: 2,
			_shieldMultiplier: 1,
			_isExplosionColorful: false,
			_isKillDefense: false,
			lastKill: (-10) ** 299,
			lastHealthRegen: (-10) ** 299,
			regenAmount: 1,
			regenSpeed: 1,
			collected: [],
			uniqueCollected: [],
			options: [],
			unlocked: [],
			pool: [...this.defaultPool]
		}
	},

	set defaults(val) { throw new Error('upgrades.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},

	get(name) {
		this.collected.push(this[name])
		this.apply()
	},
	applyRegen() {
		if (
			this.isHealthRegen &&
			simulation.time - this.lastHealthRegen >= 1 / this.regenSpeed &&
			state.player &&
			state.player.health < state.player.maxHealth
		) {
			state.player.heal(this.regenAmount * this.healEffect)
			this.lastHealthRegen = simulation.time
		}
	},
}

upgrades.militarism = new upgrades.Upgrade({
	id: 'militarism',
	name: 'Militarism',
	stackSize: 5,
	description: `1.3x ${text('damage', 'damage')}`,
	effect() { state.player.damageDone *= 1.3 }
})

upgrades.reactiveArmor = new upgrades.Upgrade({
	id: 'reactiveArmor',
	name: 'Reactive Armor',
	stackSize: 5,
	description: `0.65x ${text('damage-taken', 'damage taken')}`,
	effect() { state.player.damageTaken *= 0.65 }
})

upgrades.liquidCooling = new upgrades.Upgrade({
	id: 'liquidCooling',
	name: 'Liquid Cooling',
	description: `1.3x ${text('movement-speed', 'movement speed')}, 2.5x ${text('fire-rate', 'fire rate')}, and 1.5x ${text('magnet-range', 'magnet range')}`,
	effect() {
		state.player.velocity *= 1.3
		upgrades.fireRate *= 2.5
		upgrades.magnetRange *= 1.5
	}
})

upgrades.strengthenedAlloys = new upgrades.Upgrade({
	id: 'strengthenedAlloys',
	name: 'Strengthened Alloys',
	stackSize: 3,
	description: `1.2x ${text('health', 'max health')}`,
	effect() { state.player.maxHealth *= 1.2 }
})

upgrades.maintenance = new upgrades.Upgrade({
	id: 'maintenance',
	name: 'Maintenance',
	stackSize: 5,
	description: `1.5x health per ${text('health', 'heal')}`,
	effect() { upgrades.healEffect *= 1.5 }
})

upgrades.ironWill = new upgrades.Upgrade({
	id: 'ironWill',
	name: 'Iron Will',
	stackSize: 3,
	description: `1.5x ${text('duration', 'invulnerability duration')}`,
	effect() { upgrades.invulnerabilityDuration *= 1.5 }
})

upgrades.reinforcedShields = new upgrades.Upgrade({
	id: 'reinforcedShields',
	name: 'Reinforced Shields',
	stackSize: 3,
	description: `1.5x ${text('duration', 'shield power-up effect')}`,
	effect() { upgrades.shieldEffect *= 1.5 }
})

upgrades.regeneration = new upgrades.Upgrade({
	id: 'regeneration',
	name: 'Regeneration',
	description: `Regenerate over time based on ${text('health', 'heal effect')}`,
	requirements() { return true }, // Always available once unlocked
	effect() { // Effect is applied when chosen
		upgrades.isHealthRegen = true
		upgrades.unlocked.push('regen')
		upgrades.lastHealthRegen = simulation.time
	}
}) // Changed from `text.heal} effect` to `text.heal} ${text.effect}`

upgrades.acceleratedHealing = new upgrades.Upgrade({
	id: 'acceleratedHealing',
	name: 'Accelerated Healing',
	stackSize: Infinity,
	description: `1.5x ${text('health', 'regeneration speed')}`, // Description for when it's available
	requirements() { return upgrades.unlocked.includes('regen') }, // Requires 'regen' to be unlocked
	effect() { upgrades.regenSpeed *= 1.5 }
})

upgrades.looting = new upgrades.Upgrade({
	id: 'looting',
	name: 'Looting',
	stackSize: 5,
	description: `1.5x power-up spawn chance`,
	effect() { upgrades.powerUpSpawnChance *= 1.5 }
})

upgrades.logistics = new upgrades.Upgrade({
	id: 'logistics',
	name: 'Logistics',
	stackSize: 2,
	description: `3x ${text('ammo', 'ammo yield')}`,
	effect() { upgrades.ammoYield *= 3 }
})

upgrades.pyrotechnics = new upgrades.Upgrade({
	id: 'pyrotechnics',
	name: 'Pyrotechnics',
	description: `1.2x ${text('explosion', 'explosion damage')} and ${text('explosion', 'explosion size')} <br> ${text('explosion', 'explosions')} are colorful.`,
	requirements() { return upgrades.unlocked.includes('explosions') }, // Requires 'explosions' to be unlocked
	effect() { // Effect is applied when chosen
		bullets.explosions.damageDone *= 1.2
		bullets.explosions.size *= 1.2
		upgrades.isExplosionColorful = true
	}
})

upgrades.incendiaryMunitions = new upgrades.Upgrade({
	id: 'incendiaryMunitions',
	name: 'Incendiary Munitions',
	description: `${text('bullets', 'Bullets')} from ${text('gun', 'Shotgun')}, ${text('gun', 'Bouncy Balls')}, ${text('gun', 'SMG')}, and ${text('gun', 'Rifle')} ${text('explosion', 'explode')} upon contact.<br>0.5x ${text('gun', 'Shotgun')} ${text('bullets', 'pellets')} per shot`, // Description for when it's available
	requirements() { return upgrades.unlocked.some(id => ['shotgun', 'rifle', 'smg', 'bouncy balls'].includes(id)) }, // Requires one of these gun types to be unlocked
	effect() {
		upgrades.isBulletExplode = true
		upgrades.unlocked.push('explosions')
		upgrades.shotgunPellets *= 0.5
	}
})

upgrades.nitroglycerin = new upgrades.Upgrade({
	id: 'nitroglycerin',
	name: 'Nitroglycerin',
	stackSize: 1, // Description for when it's available
	description: `1.5x ${text('explosion', 'explosion damage')}, but 0.8x ${text('explosion', 'explosion size')}`,
	requirements() { return upgrades.unlocked.includes('explosions') }, // Requires 'explosions' to be unlocked
	effect() {
		bullets.explosions.damageDone *= 1.5
		bullets.explosions.size *= 0.8
	}
})

upgrades.MIRV = new upgrades.Upgrade({
	id: 'MIRV',
	name: 'MIRV',
	stackSize: 10, // Description for when it's available
	description: `Shoot an extra ${text('gun', 'missile')} per shot<br>0.9x ${text('gun', 'missile')} ${text('explosion', 'explosion damage')} and ${text('explosion', 'explosion size')}`,
	requirements() {
		return upgrades.unlocked.includes('missiles')
	}, // Requires 'missiles' to be unlocked
	effect() {
		upgrades.missilesPerShot++
		upgrades.missileExplosionDamage *= 0.9
		upgrades.missileExplosionSize *= 0.9
	}
})

upgrades.heavyCaliber = new upgrades.Upgrade({
	id: 'heavyCaliber',
	name: 'Heavy Caliber',
	stackSize: 5, // Description for when it's available
	description: `1.4x ${text('damage', 'damage')}, but 0.8x ${text('fire-rate', 'fire rate')}`,
	effect() {
		state.player.damageDone *= 1.4
		upgrades.fireRate *= 0.8
	}
})

upgrades.speedLoader = new upgrades.Upgrade({
	id: 'speedLoader',
	name: 'Speed Loader',
	stackSize: 3, // Description for when it's available
	description: `1.5x ${text('reload', 'reload speed')}`,
	effect() { upgrades.reloadSpeed *= 1.5 }
})

upgrades.energyShield = new upgrades.Upgrade({
	id: 'energyShield',
	name: 'Energy Shield',
	stackSize: 5,
	description: `Add a ${text('health', 'shield')} that absorbs up to 25 ${text('damage', 'damage')}.`,
	effect() {
		state.player.maxShield += 25
		state.player.shield += 25
	}
})

upgrades.deadlyAim = new upgrades.Upgrade({
	id: 'deadlyAim',
	name: 'Deadly Aim',
	stackSize: 5,
	description: `+10% ${text('damage', 'crit chance')} and +0.5x ${text('damage', 'crit multiplier')}`,
	effect() {
		upgrades.critChance += 0.1
		upgrades.critMultiplier += 0.5
	}
})

upgrades.powerSurge = new upgrades.Upgrade({
	id: 'powerSurge',
	name: 'Power Surge',
	stackSize: 3, // Description for when it's available
	description: `1.2x ${text('fire-rate', 'fire rate')} and ${text('movement-speed', 'movement speed')}`,
	effect() {
		upgrades.fireRate *= 1.2
		state.player.velocity *= 1.2
	}
})

upgrades.vampirism = new upgrades.Upgrade({
	id: 'vampirism',
	name: 'Vampirism',
	stackSize: 5, // Description for when it's available
	description: `${text('health', 'Heal')} for 10% of ${text('damage', 'damage dealt')} to mobs`,
	effect() {
		upgrades.isVampire = true
		upgrades.vampireHealAmmount += 0.05
	}
})

upgrades.sharpenedEdge = new upgrades.Upgrade({
	id: 'sharpenedEdge',
	name: 'Sharpened Edge',
	stackSize: 5, // Description for when it's available
	description: `1.2x ${text('gun', 'knife')} ${text('range', 'range')} and swing ${text('duration', 'duration')}`,
	requirements() { return upgrades.unlocked.includes('knife') },
	effect() {
		upgrades.knifeDuration *= 1.2
	}
})

upgrades.clusterBomb = new upgrades.Upgrade({
	id: 'clusterBomb',
	name: 'Cluster Bomb',
	stackSize: 5, // Description for when it's available
	description: `${text('gun', 'Missiles')} and ${text('gun', 'Grenades')} ${text('explosion', 'explode')} into smaller ${text('explosion', 'sub-explosions')} upon detonation`,
	requirements() { return upgrades.unlocked.includes('missiles') || upgrades.unlocked.includes('grenades') },
	effect() {
		upgrades.isClusterBomb = true
		upgrades.clusterBombCount += 2
	}
})

upgrades.napalm = new upgrades.Upgrade({
	id: 'napalm',
	name: 'Napalm',
	description: `${text('fire', 'Flames')} leave lingering pools of ${text('fire', 'fire')} on the ground that deal ${text('damage', 'damage')} over time.`,
	requirements() {
		return upgrades.unlocked.includes('flamethrower') || upgrades.unlocked.includes('flames')
	},
	effect() {
		upgrades.isNapalm = true
	}
})

upgrades.tacticalEfficiency = new upgrades.Upgrade({
	id: 'tacticalEfficiency',
	name: 'Tactical Efficiency',
	stackSize: 5, // Description for when it's available
	description: `2x ${text('gun', 'Sniper')} ${text('reload', 'reload speed')} and 2x ${text('gun', 'Sniper')} ${text('fire-rate', 'fire rate')}`,
	requirements() { return upgrades.unlocked.includes('sniper') },
	effect() {
		guns.sniper.reloadTime *= 0.5
		guns.sniper.fireRate *= 2
	}
})

upgrades.leadStorm = new upgrades.Upgrade({
	id: 'leadStorm',
	name: 'Lead Storm',
	stackSize: 3, // Description for when it's available
	description: `Add 5 more ${text('pellets', 'pellets')} to each ${text('gun', 'shotgun')} blast`,
	requirements() { return upgrades.unlocked.includes('shotgun') },
	effect() { upgrades.shotgunPellets += 5 }
})

upgrades.deadEye = new upgrades.Upgrade({
	id: 'deadEye',
	name: 'Dead Eye',
	stackSize: 5, // Description for when it's available
	description: `1.5x ${text('gun', 'pistol')} ${text('damage', 'damage')}`, // Already uses text.damage
	requirements() { return upgrades.unlocked.includes('pistol') },
	effect() { guns.pistol.damage *= 1.5 }
})

upgrades.highCapMags = new upgrades.Upgrade({
	id: 'highCapMags',
	name: 'High-Capacity Mags',
	stackSize: 2, // Description for when it's available
	description: `1.5x ${text('gun', 'SMG')} ${text('magazine-size', 'magazine size')}`,
	requirements() { return upgrades.unlocked.includes('smg') },
	effect() { guns.smg.magSize = Math.floor(guns.smg.magSize * 1.5) }
})

upgrades.internalCooling = new upgrades.Upgrade({
	id: 'internalCooling',
	name: 'Internal Cooling',
	stackSize: 3, // Description for when it's available
	description: `2x ${text('gun', 'minigun')} ${text('damage', 'damage')}`, // Already uses text.damage
	requirements() { return upgrades.unlocked.includes('minigun') },
	effect() { guns.minigun.damage *= 2 }
})

upgrades.superball = new upgrades.Upgrade({
	id: 'superball',
	name: 'Superball',
	stackSize: 5, // Description for when it's available
	description: `+3 ${text('gun', 'bouncy ball')} ${text('bounces', 'bounces')}`,
	requirements() { return upgrades.unlocked.includes('bouncy balls') },
	effect() { guns.bouncyBalls.piercing += 3 }
})

upgrades.refractiveLens = new upgrades.Upgrade({
	id: 'refractiveLens',
	name: 'Refractive Lens',
	stackSize: 5, // Description for when it's available
	description: `2x ${text('laser', 'laser')} ${text('damage', 'damage')}`, // Already uses text.damage
	requirements() { return upgrades.unlocked.includes('laser') },
	effect() { guns.laser.damage *= 2 }
})

upgrades.lightCaliber = new upgrades.Upgrade({
	id: 'lightCaliber',
	name: 'Light Caliber',
	stackSize: 5, // Description for when it's available
	description: `0.8x ${text('damage', 'damage')}, but 1.4x ${text('fire-rate', 'fire rate')}`,
	effect() {
		state.player.damageDone *= 0.8
		upgrades.fireRate *= 1.4
	}
})

upgrades.pool = [...upgrades.defaultPool]