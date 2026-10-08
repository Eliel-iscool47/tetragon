var level = {
	_intermission: 15,
	get intermission() {
		return this._intermission
	},
	set intermission(val) {
		this._intermission = val
	},

	_config: {},
	get config() {
		return this._config
	},
	set config(val) {
		this._config = val
	},

	_time: 0,
	get time() { return this._time },
	set time(val) { this._time = val },

	_current: 0,
	get current() { return this._current },
	set current(val) { this._current = val },

	_loadedLevels: [],
	get levels() {
		return this._loadedLevels
	},
	set levels(val) {
		if (typeof val == 'object') this._loadedLevels = val
	},

	async init() {
		try {
			const response = await fetch('./assets/levels.json')
			if (!response.ok) throw new Error('Network response was not ok')
			this._loadedLevels = await response.json()
			console.log('Levels loaded successfully from JSON.')
		} catch (error) {
			console.warn('Failed to load levels.json, using defaults:', error)
			this._loadedLevels = this.defaults._loadedLevels
		}
	},

	make() {
		// 1. Halt execution if assets are missing
		if (!this.levels || this.levels.length === 0) return;

		// 2. Strict gamemode boundary tracking
		if (simulation.gamemode === 'tutorial') {
			this.current = 0;
		} else {
			if (this.current < 1) this.current = 1;
		}

		// 3. Safe lookup using slice to prevent array mutation
		this.config = this.levels
			.slice()
			.reverse()
			.find(l => this.current >= l.threshold);

		if (!this.config) return;

		if (this.config.isBoss) spawn.randomBoss(
			randInt(collisions.border.left, collisions.border.right),
			randInt(collisions.border.top, collisions.border.bottom),
		)
		this.time = simulation.time
		document.title = `Tetragon: level ${this.current}`
		
		if (guns.inventory.length <= 0) powerUps.spawn(
			randInt(collisions.border.left, collisions.border.right),
			randInt(collisions.border.top, collisions.border.bottom),
			powerUps.gun
		)
        
		// ... rest of your parseCount, spawn loop, and powerUp loops stay the same



		// Helper to parse count as a number, function, or formula string
		const parseCount = (val) => {
			if (typeof val === 'string') {
				try {
					// Replace 'c' (case-insensitive) with the current level and evaluate
					return eval(val.replace(/c/gi, this.current))
				} catch (e) {
					console.warn(`Failed to parse formula: ${val}`, e)
					return 1
				}
			}
			return (typeof val == 'function' ? val(this.current) : (val ?? 1))
		}

		if (this.config?.spawns) {
			this.config.spawns.forEach(s => {
				const rawCount = parseCount(s.count) * state.difficultyScale
				const count = Math.floor(rawCount) + (percentChance(rawCount % 1) ? 1 : 0)
				repeat(() => {
					if (spawn[s.type]) {
						spawn[s.type](
							randInt(collisions.border.left, collisions.border.right),
							randInt(collisions.border.top, collisions.border.bottom)
						)
					}
				}, count)
			})
		}

		if (this.config?.powerUpSpawns) {
			this.config.powerUpSpawns.forEach(p => {
				const rawCount = parseCount(p.count) / state.difficultyScale
				const count = Math.floor(rawCount) + (percentChance(rawCount % 1) ? 1 : 0)
				repeat(function () {
					if (powerUps[p.type]) {
						powerUps.spawn(
							randInt(collisions.border.left, collisions.border.right),
							randInt(collisions.border.top, collisions.border.bottom),
							powerUps[p.type]
						)
					}
				}, count)
			})
		} else repeat(function () {
			// Spawn common power-ups for every level
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.ammo
			)
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.heal
			)
			powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.reroll
			)
			if (percentChance(0.15)) powerUps.spawn(
				randInt(collisions.border.left, collisions.border.right),
				randInt(collisions.border.top, collisions.border.bottom),
				powerUps.overdrive
			)
		}, 2)
	},
	get defaults() {
		return {
			intermission: 15,
			time: 0,
			current: 0,
			config: {},
			_loadedLevels: [
				{
					"threshold": 0,
					"title": "Tutorial",
					"spawns": [{ "type": "tutorial", "count": 1 }],
					"powerUpSpawns": []
				},
				{
					"threshold": 1,
					"title": "Incursion",
					"spawns": [{ "type": "default", "count": 5 }],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 3 },
						{ "type": "heal", "count": 3 },
						{ "type": "reroll", "count": 2 },
						{ "type": "invincibility", "count": 1 },
						{ "type": "overdrive", "count": 1 }
					]
				},
				{
					"threshold": 6,
					"title": "Defensive Line",
					"spawns": [
						{ "type": "default", "count": 5 },
						{ "type": "sentry", "count": 3 }
					],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 3 },
						{ "type": "heal", "count": 3 },
						{ "type": "reroll", "count": 2 },
						{ "type": "invincibility", "count": 1 },
						{ "type": "overdrive", "count": 1 }
					]
				},
				{
					"threshold": 11,
					"title": "Triple Threat",
					"spawns": [
						{ "type": "default", "count": 5 },
						{ "type": "sentry", "count": 4 },
						{ "type": "grenadier", "count": 3 }
					],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 2 },
						{ "type": "heal", "count": 2 },
						{ "type": "reroll", "count": 2 },
						{ "type": "invincibility", "count": 1 }
					]
				},
				{
					"threshold": 16,
					"title": "The Vanguard",
					"spawns": [
						{ "type": "default", "count": 8 },
						{ "type": "tank", "count": 8 },
						{ "type": "grenadier", "count": 8 },
						{ "type": "sentry", "count": 8 }
					],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 2 },
						{ "type": "heal", "count": 2 },
						{ "type": "reroll", "count": 2 },
						{ "type": "invincibility", "count": 1 }
					]
				},
				{
					"threshold": 21,
					"title": "Elite Force",
					"spawns": [
						{ "type": "archer", "count": 5 },
						{ "type": "tank", "count": 12 },
						{ "type": "grenadier", "count": 8 },
						{ "type": "default", "count": 10 },
						{ "type": "sentry", "count": 12 }
					],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 2 },
						{ "type": "heal", "count": 2 },
						{ "type": "reroll", "count": 2 },
						{ "type": "invincibility", "count": 1 }
					]
				},
				{
					"threshold": 31,
					"title": "The Depths",
					"spawns": [
						{ "type": "default", "count": "c - 15" },
						{ "type": "tank", "count": "c - 20" },
						{ "type": "archer", "count": "c - 25" },
						{ "type": "grenadier", "count": "c - 15" },
						{ "type": "sentry", "count": "c - 15" }
					],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 2 },
						{ "type": "heal", "count": 2 },
						{ "type": "invincibility", "count": 1 }
					]
				},
				{
					"threshold": 41,
					"title": "The Swarm",
					"spawns": [{ "type": "default", "count": "c + 10" }],
					"powerUpSpawns": [
						{ "type": "ammo", "count": 2 },
						{ "type": "heal", "count": 2 },
						{ "type": "invincibility", "count": 1 },
						{ "type": "overdrive", "count": 1 }
					]
				}
			]
		}
		// return { intermission: 15, time: 0, current: 0, config: {}, _loadedLevels: this._loadedLevels }
	},

	set defaults(val) { throw new Error('level.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},

	next() {
		this.current++
	},

	isWon() {
		// FIX: If the levels haven't loaded from the JSON file yet, freeze progression!
		if (!this.levels || this.levels.length === 0) return false;

		const levelConfig = this.levels
			.slice()
			.reverse()
			.find(l => this.current >= l.threshold)

		if (level.current === 0 || simulation.gamemode === 'tutorial') return simulation.isTutorialComplete

		if (levelConfig && levelConfig.winCondition) {
			return levelConfig.winCondition(state)
		}
		return mobs.list.every(m => m.class !== 'boss')
	},

}