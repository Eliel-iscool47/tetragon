var guns = {
	inventory: [],
	defaultPool: [],
	pool: [],
	options: [],
	_equippedGun: undefined,
	get equippedGun() { return this._equippedGun },
	set equippedGun(val) { this._equippedGun = val },

	_lastBulletShot: (-10) ** 299,
	get lastBulletShot() { return this._lastBulletShot },
	set lastBulletShot(val) { this._lastBulletShot = val },

	Gun: class {
		constructor(config) {
			this.id = config.id
			this.name = config.name
			this.description = config.description
			this.ammo = 0
			this.defaultAmmo = config.defaultAmmo || 0
			this.magSize = config.magSize || 1
			this.magazines = config.magazines || 0
			this.damage = config.damage || 1
			this.fireRate = config.fireRate || 1
			this.bulletDuration = config.bulletDuration || 1
			this.spread = config.spread || 0
			this.piercing = config.piercing || 1
			this.isMuzzleFlash = config.isMuzzleFlash ?? true
			this.reloadAnimation = config.reloadAnimation ?? function () { }
			this.reloadTime = this.magSize != 1 ? (config.reloadTime || 1) : 1 / this.fireRate
			this.isReloading = false
			this.reloadStartTime = 0
			this.unlockables = [...config.unlockables || []]
			this._customHUDEntry = config.HUDEntry
			// Custom unique logic
			this._shoot = config.shoot
			this._get = config.get
		}

		get HUDEntry() {
			return this._customHUDEntry || `<div class="gun-hud-item">
				<span class="gun-hud ${this == guns.equippedGun ? 'equipped' : 'unequipped'}">
					${this.name}: ${Math.round(this.ammo)}/${Math.round(this.magazines * this.magSize)}
				</span>
				<div class="gun-tooltip">${this.description}</div>
			</div>`
		}

		reset() {
			this.ammo = 0
			this.magazines = this.defaultAmmo === Infinity ? Infinity : 0
			this.isReloading = false
			this.reloadStartTime = 0
		}

		equip() {
			if (guns.inventory.includes(this)) guns.equippedGun = this
		}

		drop() {
			const index = guns.inventory.indexOf(this)
			guns.inventory = guns.inventory.filter(function (g) { return g != this && g }.bind(this))
			if (guns.equippedGun == this) guns.equippedGun = guns.inventory.at(-1) ?? guns.inventory.at(-1) ?? guns.inventory.at(0)
			simulation.log(`guns.drop(${this.id})`)
		}

		reload() {
			if (this.magazines <= 0) {
				simulation.log(`guns.${this.id}.ammo == 0`)
				return undefined
			}
			if (
				this.isReloading || (
					this.ammo >= this.magSize &&
					this.magSize != Infinity
				)
			) return undefined
			this.isReloading = true
			this.reloadStartTime = simulation.time
		}

		get(mags) {
			mags ??= (this.defaultAmmo === Infinity) ? Infinity : this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function (g) { return g != this }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.get(\"${this.id}\", ${mags === Infinity ? 'Infinity' : Math.round(mags * 10) / 10})`)
			if (this._get) this._get()
			upgrades.unlocked = upgrades.unlocked.filter(id => !this.unlockables.includes(id))
			upgrades.unlocked.push(...this.unlockables)
		}

		drawReload() {
			if (!this.isReloading) return
			const progress = clamp((simulation.time - this.reloadStartTime) / (this.reloadTime / upgrades.reloadSpeed), 0, 1)
			const width = state.player.size * 1.5
			const height = 6
			const x = state.player.pos.x - width / 2
			const y = state.player.pos.y - state.player.size * 0.8

			draw.save()
			draw.fillStyle = "rgba(0, 0, 0, 0.4)"
			draw.fillRect(x, y, width, height)
			draw.fillStyle = "white"
			draw.fillRect(x, y, width * progress, height)
			draw.strokeStyle = "black"
			draw.lineWidth = 1
			draw.strokeRect(x, y, width, height)
			draw.restore()

			this.reloadAnimation(progress)
		}

		shoot() {
			if (this.isReloading) return undefined
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			this._shoot()
			this.ammo--
		}
	},

	get defaults() {
		return {
			inventory: [],
			options: [],
			equippedGun: undefined,
			lastBulletShot: (-10) ** 299,
			pool: [...this.defaultPool]
		}
	},

	set defaults(val) { throw new Error('guns.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
		this.defaultPool.forEach(g => g.reset())
	},

	get(g, mags) {
		mags ??= 1
		this[g]?.get(mags)
	},
	allGuns() { },
	drop(g) {
		this[g]?.drop()
	},
	equip(g) {
		this[g]?.equip()
	},
	logic() {
		this.inventory.forEach(function (g) {
			if (g.isReloading && simulation.time - g.reloadStartTime >= (g.reloadTime / upgrades.reloadSpeed)) {
				g.isReloading = false
				if (g.magSize == Infinity) {
					g.ammo = Infinity
				} else {
					const availableReserve = g.magazines * g.magSize
					const amountToReload = Math.min(g.magSize - g.ammo, availableReserve)
					g.ammo += amountToReload
					g.magazines -= amountToReload / g.magSize
				}
			}
		})
	},
	randomizeOptions() {
		guns.options = []
		let tempPool = [...this.pool]
		repeat(function () {
			if (tempPool.length <= 0) return undefined
			const r = randInt(0, tempPool.length - 1)
			const key = tempPool.at(r)
			this.options.push(key)
			tempPool = tempPool.filter((_, i) => i !== r)
		}.bind(this), upgrades.optionsPerPowerUp)
	},
	choose() {
		if (!this.pool || this.pool.length <= 0) return undefined
		this.randomizeOptions()
		if (!simulation.isChoosing) simulation.isChoosing = true
		buttons.currentChoose = this
		chooseScreen.style.display = 'block'
		chooseScreen.style.width = '100%'
		chooseScreen.style.height = '100%'
		chooseScreen.style.left = '0'
		chooseScreen.style.top = '0'
		chooseScreen.style.color = 'black'
		chooseScreen.style.overflowY = 'auto'
		chooseScreen.style.position = 'fixed'
		chooseScreen.innerHTML = `
		<div style="padding-top: 15vh; text-align: center; width: 100%;">
			<div style="font-size: 24px; margin-bottom: 20px;">Choose a gun:</div>
			${Math.ceil(upgrades.rerolls - 0.5) > 0 ? buttons.rerollButton() : ''}
			${buttons.cancelButton()}
			<div style="padding: 20px 0;">
				${this.options.filter(g => g !== undefined).map(g => `
					<button class="gun-button" onclick='guns.${g.id}.get(); simulation.isChoosing = false'>
						<strong>${g.name}</strong>: ${g.description}
					</button>
				`).join('')}
			</div>
			<div style="height: 50px;"></div>
		</div>
		`
	}
}

guns.rifle = new guns.Gun({
	id: 'rifle',
	name: 'rifle',
	description: `Rapidly shoot ${text('bullets', 'bullets')} at a decent ${text('speed', 'speed')}<br>30 ${text('ammo', 'ammo')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 420,
	magSize: 30,
	magazines: 3,
	damage: 1.2,
	fireRate: 20,
	unlockables: ['bullets', 'rifle'],
	shoot() {
		bullets.rifleBullet(state.player.pos.x, state.player.pos.y)
	}
})

guns.shotgun = new guns.Gun({
	id: 'shotgun',
	name: 'shotgun',
	description: `Shoot a wide burst of ${text('range', 'short-range')} ${text('pellets', 'pellets')}<br>3 ${text('ammo', 'shells')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 24,
	magSize: 3,
	magazines: 15,
	damage: 1.15,
	fireRate: 1,
	bulletDuration: 0.4,
	spread: 30,
	unlockables: ['shotgun', 'bullets'],
	shoot() {
		repeat(() => bullets.shotgunBullet(state.player.pos.x, state.player.pos.y), upgrades.shotgunPellets)
	}
})

guns.sniper = new guns.Gun({
	id: 'sniper',
	name: 'sniper',
	description: `Shoot a high-caliber shot that ${text('piercing', 'pierces')} through mobs<br>3 ${text('ammo', 'ammo')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 30,
	magSize: 3,
	magazines: 3,
	damage: 13,
	bulletDuration: 4,
	fireRate: 1.3,
	reloadTime: 8,
	unlockables: ['sniper', 'bullets'],
	shoot() { bullets.sniperBullet(state.player.pos.x, state.player.pos.y) }
})

guns.smg = new guns.Gun({
	id: 'smg',
	name: 'SMG',
	description: `Rapidly shoot rounds faster than rifle, but slower than minigun<br>50 ${text('ammo', 'ammo')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 750,
	magSize: 50,
	magazines: 2,
	damage: 0.8,
	fireRate: 40,
	unlockables: ['smg', 'bullets'],
	shoot() { bullets.smgBullet(state.player.pos.x, state.player.pos.y) }
})

guns.pistol = new guns.Gun({
	id: 'pistol',
	name: 'pistol',
	description: `It\'s a pistol, I don\'t know what else to tell you<br>10 ${text('ammo', 'ammo')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 180,
	magSize: 10,
	magazines: 5,
	damage: 1.4,
	fireRate: 6,
	unlockables: ['pistol', 'bullets'],
	shoot() { bullets.pistolBullet(state.player.pos.x, state.player.pos.y) }
})

guns.minigun = new guns.Gun({
	id: 'minigun',
	name: 'minigun',
	description: `Shoot a lot of ${text('bullets', 'bullets')} really fast<br>100 ${text('ammo', 'ammo')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 2000,
	magSize: 100,
	magazines: 0,
	damage: 0.15,
	fireRate: 100,
	unlockables: ['minigun', 'bullets'],
	shoot() { bullets.minigunBullet(state.player.pos.x, state.player.pos.y) }
})

guns.grenadeLauncher = new guns.Gun({
	id: 'grenadeLauncher',
	name: 'grenade launcher',
	description: `Launch a grenade that ${text('explosion', 'explodes')} upon contact<br>6 ${text('ammo', 'grenades')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 72,
	magSize: 6,
	magazines: 10,
	damage: 1.3,
	fireRate: 2,
	bulletDuration: 1.5,
	unlockables: ['grenades', 'explosions', 'bullets'],
	shoot() {
		bullets.grenade(state.player.pos.x, state.player.pos.y)
	}
})

guns.missiles = new guns.Gun({
	id: 'missiles',
	name: 'missiles',
	description: `Launch a ${text('homing', 'homing')} missile that tracks nearby mobs<br>3 ${text('ammo', 'missiles')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 50,
	magSize: 3,
	magazines: 20,
	damage: 4,
	fireRate: 1.4,
	bulletDuration: 20,
	unlockables: ['missiles', 'explosions', 'bullets'],
	shoot() {
		let fired = 0
		const launch = () => {
			if (fired >= upgrades.missilesPerShot) return
			if (simulation.isPaused || simulation.isChoosing || simulation.isDead) {
				setTimeout(launch, 50)
				return
			}
			bullets.missile(state.player.pos.x, state.player.pos.y, rand(-0.15, 0.15))
			if (this.isMuzzleFlash) bullets.muzzleFlash()
			fired++
			if (fired < upgrades.missilesPerShot) setTimeout(launch, 200)
		}
		launch()
	}
})

guns.bouncyBalls = new guns.Gun({
	id: 'bouncyBalls',
	name: 'bouncy balls',
	description: `Shoot 5 ${text('bullets', 'bouncy balls')} that ${text('bounces', 'bounce')} off the borders of the map and mobs up to 3 times.<br>25 ${text('ammo', 'balls')} (5 shots)per ${text('ammo', 'magazine')}`,
	defaultAmmo: 80,
	magSize: 5,
	magazines: 30,
	damage: 3,
	fireRate: 4,
	bulletDuration: 8,
	isMuzzleFlash: false,
	unlockables: ['bouncy balls', 'bullets'],
	reloadTime: 0.8,
	piercing: 3,
	shoot() {
		repeat(function () {
			bullets.bouncyBall(
				state.player.pos.x + rand(
					-state.player.size / 2, state.player.size / 2
				), state.player.pos.y + rand(
					-state.player.size / 2, state.player.size / 2
				)
			)
		}, upgrades.bouncyBallsPerShot)
	}
})

guns.flamethrower = new guns.Gun({
	id: 'flamethrower',
	name: 'flamethrower',
	description: `Use ${text('fire', 'fire')} to burn your enemies!<br>150 ${text('ammo', 'flames')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 2000,
	magSize: 200,
	magazines: 3,
	damage: 0.4,
	fireRate: 80,
	bulletDuration: 0.8,
	spread: 25,
	isMuzzleFlash: false,
	unlockables: ['flamethrower', 'flames', 'bullets'],
	shoot() { bullets.flame(state.player.pos.x, state.player.pos.y) }
})

guns.laser = new guns.Gun({
	id: 'laser',
	name: 'Laser',
	description: `Fire a beam of ${text('laser', 'light')} that travels instantly across the screen<br>Doesn't use ${text('ammo', 'ammo')}`,
	defaultAmmo: Infinity,
	magSize: Infinity,
	magazines: Infinity,
	damage: 1,
	fireRate: Infinity,
	bulletDuration: 0.05,
	isMuzzleFlash: false,
	unlockables: ['laser', 'bullets'],
	shoot() {
		bullets.laserBeam(state.player.pos.x, state.player.pos.y)
		const maxRange = Math.max(main.width, main.height)
		mobs.list.forEach((mob) => {
			if (lineCircleCollision(state.player.pos.x, state.player.pos.y, state.player.pos.x + Math.cos(input.cursor.angle) * maxRange, state.player.pos.y + Math.sin(input.cursor.angle) * maxRange, mob.pos.x, mob.pos.y, mob.size / 2)) {
				mob.takeDamage(guns.laser.damage * state.player.damageDone)
			}
		})
	}
})

guns.knife = new guns.Gun({
	id: 'knife',
	name: 'Knife',
	description: `Quickly stab enemies with a knife<br>1 ${text('ammo', 'knife')} per ${text('ammo', 'magazine')}`,
	defaultAmmo: 30,
	magSize: 1,
	magazines: 30,
	damage: 12,
	fireRate: 5,
	bulletDuration: 0.2,
	isMuzzleFlash: false,
	unlockables: ['knife', 'bullets'],
	reloadTime: 0.2,
	shoot() {
		bullets.slash(state.player.pos.x, state.player.pos.y, state.input.cursor.angle)
		const range = state.player.size * 1.5 * state.upgrades.knifeRange
		state.mobs.list.forEach((mob) => {
			const dist = distance(state.player.pos.x, state.player.pos.y, mob.pos.x, mob.pos.y)
			const mobAngle = angle(mob.pos.x, mob.pos.y, state.player.pos.x, state.player.pos.y)
			// Check if mob is in range and within an arc of ~90 degrees (0.8 radians)
			if (dist < range + mob.size / 2 && diffAngle(state.input.cursor.angle, mobAngle) < 0.8) {
				mob.takeDamage(this.damage * state.player.damageDone)
			}
		})
	}
})

guns.defaultPool = [
	guns.rifle,
	guns.shotgun,
	guns.sniper,
	guns.smg,
	guns.pistol,
	guns.minigun,
	guns.grenadeLauncher,
	guns.missiles,
	guns.bouncyBalls,
	guns.flamethrower,
	guns.laser,
	guns.knife,
]
guns.pool = [...guns.defaultPool]
