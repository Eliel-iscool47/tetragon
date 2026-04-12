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

	rifle: {
		id: 'rifle',
		name: 'rifle',
		description: `Rapidly shoot bullets at a decent speed<br>30 ${text.ammo} per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 400,
		magSize: 30,
		magazines: 3,
		damage: 1.2,
		fireRate: 20,
		bulletDuration: 1,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.rifle.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('rifle'), 1)
			upgrades.unlocked.push('rifle', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.rifle.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.rifleBullet(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	shotgun: {
		id: 'shotgun',
		name: 'shotgun',
		description: `Shoot a wide burst of short-range pellets<br>3 <span class="styled-text ammo">shells</span> per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 25,
		magSize: 3,
		magazines: 15,
		damage: 1.15,
		fireRate: 1,
		bulletDuration: 0.4,
		spread: 30,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.shotgun.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('shotgun'), 1)
			upgrades.unlocked.push('shotgun', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {

			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.shotgun.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			repeat(function() {
				bullets.shotgunBullet(player.pos.x, player.pos.y)
			}.bind(this), 20)
			this.ammo--
		}
	},
	sniper: {
		id: 'sniper',
		name: 'sniper',
		description: `Shoot a high-caliber shot that pierces through mobs<br>3 ${text.ammo} per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 30,
		magSize: 3,
		magazines: 3,
		damage: 13,
		bulletDuration: 4,
		fireRate: 1.3,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.sniper.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('sniper'), 1)
			upgrades.unlocked.push('sniper', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {

			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.sniper.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.sniperBullet(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	smg: {
		id: 'smg',
		name: 'SMG',
		description: `Rapidly shoot rounds faster than rifle, but slower than minigun<br>50 ${text.ammo} per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 600,
		magSize: 50,
		magazines: 2,
		damage: 0.8,
		fireRate: 40,
		bulletDuration: 1,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.smg.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('smg'), 1)
			upgrades.unlocked.push('smg', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {

			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.smg.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.smgBullet(player.pos.x, player.pos.y)
			this.ammo--
		},
	},
	pistol: {
		id: 'pistol',
		name: 'pistol',
		description: `It\'s a pistol, I don\'t know what else to tell yo<br>10 ${text.ammo} per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 180,
		magSize: 10,
		magazines: 5,
		damage: 1.4,
		fireRate: 6,
		bulletDuration: 1,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.pistol.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('pistol'), 1)
			upgrades.unlocked.push('pistol', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {

			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.pistol.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.pistolBullet(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	minigun: {
		id: 'minigun',
		name: 'minigun',
		description: `Shoot a lot of bullets really fast<br>100 ${text.ammo} per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 2000,
		magSize: 100,
		magazines: 0,
		damage: 0.15,
		fireRate: 100,
		bulletDuration: 1,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			mags ??= this.defaultAmmo
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.minigun.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('minigun'), 1)
			upgrades.unlocked.push('minigun', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {

			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.minigun.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.minigunBullet(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	grenadeLauncher: {
		id: 'grenadeLauncher',
		name: 'grenade launcher',
		description: `Launch a grenade that explodes upon contact<br>6 <span class="styled-text ammo">grenades</span> per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 72,
		magSize: 6,
		magazines: 10,
		damage: 1.3,
		fireRate: 2,
		bulletDuration: 1.5,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.grenadeLauncher.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('explosions'), 1)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('grenades'), 1)
			upgrades.unlocked.push('grenades', 'explosions', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.grenadeLauncher.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.grenade(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	missiles: {
		id: 'missiles',
		name: 'missiles',
		description: `Launch a homing missile that tracks nearby mobs<br>3 <span class="styled-text ammo">missiles</span> per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 50,
		magSize: 1,
		magazines: 50,
		damage: 4,
		fireRate: 1.4,
		bulletDuration: 20,
		spread: 0,
		isMuzzleFlash: true,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.missiles.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('explosions'), 1)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('missiles'), 1)
			upgrades.unlocked.push('missiles', 'explosions', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.missiles.ammo == 0`)
				return undefined
			}
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			repeat(function() {
				bullets.missile(player.pos.x, player.pos.y)
			}.bind(this), upgrades.missilesPerShot)
			this.ammo--
		}
	},
	bouncyBalls: {
		id: 'bouncyBalls',
		name: 'bouncy balls',
		description: `Shoot 3 bouncy balls that bounce off the borders of the map and mobs<br>5 <span class="styled-text ammo">balls</span> per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 80,
		magSize: 5,
		magazines: 30,
		damage: 3,
		fireRate: 4,
		bulletDuration: 8,
		spread: 0,
		isMuzzleFlash: false,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.bouncyBalls.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('bouncy balls'), 1)
			upgrades.unlocked.push('bouncy balls', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.bouncyBalls.ammo == 0`)
				return undefined
			}
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			repeat(function() {
				bullets.bouncyBall(player.pos.x + rand(-player.size / 2, player.size / 2), player.pos.y + rand(-player.size / 2, player.size / 2))
			}.bind(this), 3)
			this.ammo--
		}
	},
	flamethrower: {
		id: 'flamethrower',
		name: 'flamethrower',
		description: `Use fire to burn your enemies!<br>150 <span class="styled-text ammo">flames</span> per ${text.powerUp.ammo}`,
		ammo: 0,
		defaultAmmo: 2000,
		magSize: 200,
		magazines: 3,
		damage: 0.4,
		fireRate: 80,
		bulletDuration: 0.8,
		spread: 25,
		isMuzzleFlash: false,
		get(mags) {
			mags ??= this.defaultAmmo / this.magSize
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.flamethrower.get(${mags})`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('flamethrower'), 1)
			upgrades.unlocked.push('flamethrower', 'flames', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.flamethrower.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			bullets.flame(player.pos.x, player.pos.y)
			this.ammo--
		}
	},
	laser: {
		id: 'laser',
		name: 'Laser',
		description: `Fire a beam of <span class="styled-text laser">light</span> that travels instantly across the screen<br>Doesn't use <span class="styled-text ammo">ammo</span>`,
		ammo: 0,
		defaultAmmo: Infinity,
		magSize: Infinity,
		magazines: Infinity,
		damage: 5,
		fireRate: 60,
		bulletDuration: 0.05,
		spread: 0,
		isMuzzleFlash: false,
		get(mags) {
			mags ??= Infinity
			if (guns.inventory.includes(this)) return undefined
			this.magazines = mags - 1
			this.ammo = this.magSize
			guns.inventory.push(this)
			guns.pool = guns.pool.filter(function(g) { return g != this; }.bind(this))
			if (guns.equippedGun == undefined) this.equip()
			simulation.log(`guns.laser.get(Infinity)`)
			upgrades.unlocked.splice(upgrades.unlocked.indexOf('laser'), 1)
			upgrades.unlocked.push('laser', 'bullets')
		},
		drop() {
			guns.inventory.splice(guns.inventory.indexOf(this), 1)
		},
		equip() {
			guns.equippedGun = this
		},
		reload() {
			if (this.magazines <= 0) {
				this.magazines = 0
				simulation.log(`guns.laser.ammo == 0`)
				return undefined
			}
			if (this.ammo > 0) return undefined
			this.magazines--
			this.ammo += this.magSize
		},
		shoot() {
			if (this.ammo <= 0) {
				this.ammo = 0
				this.reload()
				return undefined
			}
			// visual beam
			bullets.laserBeam(player.pos.x, player.pos.y)
			// apply damage along the ray: check perpendicular distance to line
			const maxRange = Math.max(main.width, main.height)
			mobs.list.forEach(function(mob) {
				// const dx = mob.pos.x - player.pos.x
				// const dy = mob.pos.y - player.pos.y
				// const dist = Math.hypot(dx, dy)
				// if (dist <= maxRange) {
				// 	const angleToMob = Math.atan2(dy, dx)
				// 	const angleDiff = diffAngle(angleToMob, input.cursor.angle)
				// 	const perp = Math.abs(Math.sin(angleDiff) * dist)
				// 	if (perp <= mob.size / 2) {
				// 		mob.health -= this.damage * player.damageDone
				// 	}
				// }
				if (lineCircleCollision(player.pos.x, player.pos.y, player.pos.x + Math.cos(input.cursor.angle) * maxRange, player.pos.y + Math.sin(input.cursor.angle) * maxRange, mob.pos.x, mob.pos.y, mob.size / 2)) {
					mob.health -= this.damage * player.damageDone
				}
			}.bind(this))
			this.ammo--
		}
	},
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
	randomizeOptions() {
		guns.options = []
		const tempPool = [...this.pool]
		repeat(function() {
			if (tempPool.length <= 0) return undefined
			const r = randInt(0, tempPool.length - 1)
			const key = tempPool.at(r)
			this.options.push(key)
			tempPool.splice(r, 1)
		}.bind(this), upgrades.optionsPerPowerUp)
	},
	choose() {
		if (this.pool.length <= 0) return undefined
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
		${this.options.filter(function(g) { return g != undefined; }.bind(this)).map(function(g) { return `<button class="gun-button"
			style="
			width: ${parseFloat(chooseScreen.style.width) * 0.6}px; 
			height: ${parseFloat(chooseScreen.style.height) / Math.floor(upgrades.optionsPerPowerUp * 1.5)}px; 
			left: 100px;
			top: ${(this.options.indexOf(g) * 1 * parseFloat(chooseScreen.style.height) / upgrades.optionsPerPowerUp) + 180}px;
			" 
			onclick='
				guns.${g.id}.get(); 	
				simulation.isChoosing = false'>${g.name}: ${g.description}</button>`; }.bind(this)).join('<br>')}
		`
	}
}
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