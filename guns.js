const guns = {
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
			this.isMuzzleFlash = config.isMuzzleFlash ?? true
			this.reloadAnimation = config.reloadAnimation ?? function () { }
			this.reloadTime = config.reloadTime || 1.2
			this.isReloading = false
			this.reloadStartTime = 0
			this.unlockables = [...config.unlockables || []]
			this._customHUDEntry = config.HUDEntry
			// Custom unique logic
			this._shoot = config.shoot
			this._get = config.get
		}

		get HUDEntry() {
			return this._customHUDEntry || `<span class="gun-hud ${this == guns.equippedGun ? 'equipped' : 'unequipped'
				}">${this.name}: ${this.ammo}/${this.magazines * this.magSize}</span>`
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
			if (this.isReloading || this.magazines <= 0 || (this.ammo >= this.magSize && this.magSize !== Infinity)) return undefined
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
			simulation.log(`guns.get(${this.id}, ${mags === Infinity ? 'Infinity' : Math.round(mags)})`)
			if (this._get) this._get()
			upgrades.unlocked.push(...this.unlockables)
		}

		drawReload() {
			if (!this.isReloading) return
			const progress = clamp((simulation.time - this.reloadStartTime) / this.reloadTime, 0, 1)
			const width = player.size * 1.5
			const height = 6
			const x = player.pos.x - width / 2
			const y = player.pos.y - player.size * 0.8

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
	}
}

guns.rifle = new guns.Gun({
	id: 'rifle',
	name: 'rifle',
	description: `Rapidly shoot bullets at a decent speed<br>30 ${text.ammo} per ${text.powerUp.ammo}`,
	defaultAmmo: 400,
	magSize: 30,
	magazines: 3,
	damage: 1.2,
	fireRate: 20,
	unlockables: ['bullets', 'rifle'],
	shoot() {
		bullets.rifleBullet(player.pos.x, player.pos.y)
	}
})

guns.shotgun = new guns.Gun({
	id: 'shotgun',
	name: 'shotgun',
	description: `Shoot a wide burst of short-range pellets<br>3 <span class="styled-text ammo">shells</span> per ${text.powerUp.ammo}`,
	defaultAmmo: 25,
	magSize: 3,
	magazines: 15,
	damage: 1.15,
	fireRate: 1,
	bulletDuration: 0.4,
	spread: 30,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'shotgun')
		upgrades.unlocked.push('shotgun', 'bullets')
	},
	shoot() {
		repeat(() => bullets.shotgunBullet(player.pos.x, player.pos.y), 20)
	}
})

guns.sniper = new guns.Gun({
	id: 'sniper',
	name: 'sniper',
	description: `Shoot a high-caliber shot that pierces through mobs<br>3 ${text.ammo} per ${text.powerUp.ammo}`,
	defaultAmmo: 30,
	magSize: 3,
	magazines: 3,
	damage: 13,
	bulletDuration: 4,
	fireRate: 1.3,
	reloadTime: 8,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'sniper')
		upgrades.unlocked.push('sniper', 'bullets')
	},
	shoot() { bullets.sniperBullet(player.pos.x, player.pos.y) }
})

guns.smg = new guns.Gun({
	id: 'smg',
	name: 'SMG',
	description: `Rapidly shoot rounds faster than rifle, but slower than minigun<br>50 ${text.ammo} per ${text.powerUp.ammo}`,
	defaultAmmo: 600,
	magSize: 50,
	magazines: 2,
	damage: 0.8,
	fireRate: 40,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'smg')
		upgrades.unlocked.push('smg', 'bullets')
	},
	shoot() { bullets.smgBullet(player.pos.x, player.pos.y) }
})

guns.pistol = new guns.Gun({
	id: 'pistol',
	name: 'pistol',
	description: `It\'s a pistol, I don\'t know what else to tell yo<br>10 ${text.ammo} per ${text.powerUp.ammo}`,
	defaultAmmo: 180,
	magSize: 10,
	magazines: 5,
	damage: 1.4,
	fireRate: 6,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'pistol')
		upgrades.unlocked.push('pistol', 'bullets')
	},
	shoot() { bullets.pistolBullet(player.pos.x, player.pos.y) }
})

guns.minigun = new guns.Gun({
	id: 'minigun',
	name: 'minigun',
	description: `Shoot a lot of bullets really fast<br>100 ${text.ammo} per ${text.powerUp.ammo}`,
	defaultAmmo: 2000,
	magSize: 100,
	magazines: 0,
	damage: 0.15,
	fireRate: 100,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'minigun')
		upgrades.unlocked.push('minigun', 'bullets')
	},
	shoot() { bullets.minigunBullet(player.pos.x, player.pos.y) }
})

guns.grenadeLauncher = new guns.Gun({
	id: 'grenadeLauncher',
	name: 'grenade launcher',
	description: `Launch a grenade that explodes upon contact<br>6 <span class="styled-text ammo">grenades</span> per ${text.powerUp.ammo}`,
	defaultAmmo: 72,
	magSize: 6,
	magazines: 10,
	damage: 1.3,
	fireRate: 2,
	bulletDuration: 1.5,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'explosions')
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'grenades')
		upgrades.unlocked.push('grenades', 'explosions', 'bullets')
	},
	shoot() {
		bullets.grenade(player.pos.x, player.pos.y)
	}
})

guns.missiles = new guns.Gun({
	id: 'missiles',
	name: 'missiles',
	description: `Launch a homing missile that tracks nearby mobs<br>3 <span class="styled-text ammo">missiles</span> per ${text.powerUp.ammo}`,
	defaultAmmo: 50,
	magSize: 1,
	magazines: 50,
	damage: 4,
	fireRate: 1.4,
	bulletDuration: 20,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'explosions')
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'missiles')
		upgrades.unlocked.push('missiles', 'explosions', 'bullets')
	},
	shoot() {
		repeat(() => bullets.missile(player.pos.x, player.pos.y), upgrades.missilesPerShot)
	}
})

guns.bouncyBalls = new guns.Gun({
	id: 'bouncyBalls',
	name: 'bouncy balls',
	description: `Shoot 3 bouncy balls that bounce off the borders of the map and mobs<br>5 <span class="styled-text ammo">balls</span> per ${text.powerUp.ammo}`,
	defaultAmmo: 80,
	magSize: 5,
	magazines: 30,
	damage: 3,
	fireRate: 4,
	bulletDuration: 8,
	isMuzzleFlash: false,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'bouncy balls')
		upgrades.unlocked.push('bouncy balls', 'bullets')
	},
	shoot() {
		repeat(() => bullets.bouncyBall(player.pos.x + rand(-player.size / 2, player.size / 2), player.pos.y + rand(-player.size / 2, player.size / 2)), 3)
	}
})

guns.flamethrower = new guns.Gun({
	id: 'flamethrower',
	name: 'flamethrower',
	description: `Use fire to burn your enemies!<br>150 <span class="styled-text ammo">flames</span> per ${text.powerUp.ammo}`,
	defaultAmmo: 2000,
	magSize: 200,
	magazines: 3,
	damage: 0.4,
	fireRate: 80,
	bulletDuration: 0.8,
	spread: 25,
	isMuzzleFlash: false,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'flamethrower')
		upgrades.unlocked.push('flamethrower', 'flames', 'bullets')
	},
	shoot() { bullets.flame(player.pos.x, player.pos.y) }
})

guns.laser = new guns.Gun({
	id: 'laser',
	name: 'Laser',
	description: `Fire a beam of <span class="styled-text laser">light</span> that travels instantly across the screen<br>Doesn't use <span class="styled-text ammo">ammo</span>`,
	defaultAmmo: Infinity,
	magSize: Infinity,
	magazines: Infinity,
	damage: 5,
	fireRate: 60,
	bulletDuration: 0.05,
	isMuzzleFlash: false,
	get() {
		upgrades.unlocked = upgrades.unlocked.filter(id => id !== 'laser')
		upgrades.unlocked.push('laser', 'bullets')
	},
	shoot() {
		bullets.laserBeam(player.pos.x, player.pos.y)
		const maxRange = Math.max(main.width, main.height)
		mobs.list.forEach((mob) => {
			if (lineCircleCollision(player.pos.x, player.pos.y, player.pos.x + Math.cos(input.cursor.angle) * maxRange, player.pos.y + Math.sin(input.cursor.angle) * maxRange, mob.pos.x, mob.pos.y, mob.size / 2)) {
				mob.health -= guns.laser.damage * player.damageDone
			}
		})
	}
})

Object.assign(guns, {
	get(g, mags) {
		mags ??= 1
		this[g]?.get(mags)
	},
	allGuns() {
		guns.rifle.get(Infinity)
		guns.shotgun.get(Infinity)
		guns.sniper.get(Infinity)
		guns.smg.get(Infinity)
		guns.pistol.get(Infinity)
		guns.minigun.get(Infinity)
		guns.grenadeLauncher.get(Infinity)
		guns.missiles.get(Infinity)
		guns.bouncyBalls.get(Infinity)
		guns.flamethrower.get(Infinity)
		guns.laser.get(Infinity)
	},
	drop(g) {
		this[g]?.drop()
	},
	equip(g) {
		this[g]?.equip()
	},
	logic() {
		this.inventory.forEach(function (g) {
			if (g.isReloading && simulation.time - g.reloadStartTime >= g.reloadTime) {
				g.isReloading = false
				g.magazines--
				g.ammo = g.magSize
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
		chooseScreen.style.position = 'absolute'
		chooseScreen.style.width = `${main.width}px`
		chooseScreen.style.left = `${main.width * 0}px`
		chooseScreen.style.top = `0`
		chooseScreen.style.margin = '0'
		chooseScreen.style.padding = '0'
		chooseScreen.style.height = `${main.height}px`
		chooseScreen.style.color = 'white'
		chooseScreen.style.textAlign = 'left'
		chooseScreen.style.overflowX = 'hidden'
		chooseScreen.style.overflowY = 'scroll'
		chooseScreen.style.position = 'fixed'
		chooseScreen.innerHTML = `
		<br>
		Choose a gun:
		<br>
		${Math.ceil(upgrades.rerolls - 0.5) > 0 ? buttons.rerollButton() : ''}
		${buttons.cancel}
			<br><br>
		${this.options.filter(function (g) { return g != undefined }.bind(this)).map(function (g) {
			return `<button class="gun-button"
			style="
			width: ${parseFloat(chooseScreen.style.width) * 0.6}px; 
			height: ${parseFloat(chooseScreen.style.height) / Math.floor(upgrades.optionsPerPowerUp * 1.5)}px; 
			left: 100px;
			top: ${(this.options.indexOf(g) * 1 * parseFloat(chooseScreen.style.height) / upgrades.optionsPerPowerUp) + 180}px;
			" 
			onclick='
				guns.${g.id}.get(); 	
				simulation.isChoosing = false'>${g.name}: ${g.description}</button>`
		}.bind(this)).join('<br>')}
		`
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
]
guns.pool = [...guns.defaultPool]