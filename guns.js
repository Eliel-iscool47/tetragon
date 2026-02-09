const guns = {
    inventory: [],
    equippedGun: undefined,
    lastBulletShot: (-10) ** 299,
    rifle: {
        name: 'rifle',
        ammo: 30,
        magSize: 30,
        magazines: 5,
        damage: 1.2,
        fireRate: 15,
        bulletDuration: 1,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                this.magazines = mags
                guns.inventory.push(this)
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.rifle.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.list.push({
                pos: {
                    x: player.pos.long + (Math.cos(Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long)) * player.size / 2),
                    y: player.pos.lat + (Math.sin(Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long)) * player.size / 2),
                },
                angle: Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long),
                speed: 10,
                timeSpawned: simulation.time,
                isHoming: false,
                isExplode: false,
                origin: this,
            })
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    shotgun: {
        name: 'shotgun',
        ammo: 5,
        magSize: 5,
        magazines: 15,
        damage: 0.8,
        fireRate: 2.5,
        bulletDuration: 0.5,
        spread: 30,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.shotgun.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            for (let index = 0; index < 20; index++) {
                bullets.list.push({
                    pos: {
                        x: player.pos.long + (Math.cos(input.cursor.angle) * player.size / 2),
                        y: player.pos.lat + (Math.sin(input.cursor.angle) * player.size / 2),
                    },
                    angle: input.cursor.angle + utils.randomFloat(-this.spread, this.spread) / 100,
                    speed: 10,
                    timeSpawned: simulation.time,
                    isHoming: false,
                    isExplode: false,
                    origin: this,
                })
            }
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    sniper: {
        name: 'sniper',
        ammo: 5,
        magSize: 5,
        magazines: 3,
        damage: 3,
        bulletDuration: 4,
        fireRate: 1.3,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.rifle.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.list.push({
                pos: {
                    x: player.pos.long,
                    y: player.pos.lat,
                },
                angle: Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long),
                speed: 10,
                timeSpawned: simulation.time,
                isHoming: false,
                isExplode: false,
                origin: this,
            })
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    smg: {
        name: 'SMG',
        ammo: 30,
        magSize: 30,
        magazines: 5,
        damage: 1.2,
        fireRate: 15,
        bulletDuration: 1,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.smg.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.list.push({
                pos: {
                    x: player.pos.long,
                    y: player.pos.lat,
                },
                angle: Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long),
                speed: 10,
                timeSpawned: simulation.time,
                isHoming: false,
                isExplode: false,
                origin: this,
            })
            this.ammo--
            this.lastBullet = simulation.time
        },
    },
    pistol: {
        name: 'pistol',
        ammo: 30,
        magSize: 30,
        magazines: 5,
        damage: 1.2,
        fireRate: 5,
        bulletDuration: 1,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.pistol.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.list.push({
                pos: {
                    x: player.pos.long,
                    y: player.pos.lat,
                },
                angle: input.cursor.angle,
                speed: 10,
                timeSpawned: simulation.time,
                isHoming: false,
                isExplode: false,
                origin: this,
            })
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    minigun: {
        name: 'minigun',
        ammo: 1000,
        magSize: 1000,
        magazines: 3,
        damage: 1,
        fireRate: 100,
        bulletDuration: 1,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.minigun.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.list.push({
                pos: {
                    x: player.pos.long,
                    y: player.pos.lat,
                },
                angle: Math.atan2(input.cursor.y - player.pos.lat, input.cursor.x - player.pos.long),
                speed: 10,
                timeSpawned: simulation.time,
                isHoming: false,
                isExplode: false,
                origin: this,
            })
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    grenadeLauncher: {
        name: 'grenade launcher',
        ammo: 6,
        magSize: 6,
        magazines: 50,
        damage: 1.3,
        fireRate: 2,
        bulletDuration: 1.5,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
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
                console.log('guns.grenadeLauncher.ammo == 0')
                return undefined
            }
            this.ammo = this.magSize
            this.magazines--
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.grenade(player.pos.long, player.pos.lat)
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    missiles: {
        name: 'missiles',
        ammo: 1,
        magSize: 1,
        magazines: 50,
        damage: 0.6,
        fireRate: 1,
        bulletDuration: 10,
        spread: 0,
        get(mags) {
            if (!guns.inventory.includes(this)) {
                guns.inventory.push(this)
                this.magazines = mags
            }
            if (guns.equippedGun == undefined) guns.equippedGun = this
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
                console.log('guns.missiles.ammo == 0')
            } else {
                this.ammo = this.magSize
                this.magazines--
            }
        },
        shoot() {
            if (this.ammo <= 0) {
                this.ammo = 0
                this.reload()
                return undefined
            }
            bullets.missile(player.pos.long, player.pos.lat)
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    airStrike(x, y) {
        setTimeout(() => {
            bullets.explode(x - 10, y, 20)
            bullets.explode(x + 10, y, 20)
            bullets.explode(x, y - 10, 20)
            bullets.explode(x, y + 10, 20)
        }, 100)
    },
    allGuns() {
        guns.rifle.get(Infinity)
        guns.shotgun.get(Infinity)
        guns.sniper.get(Infinity)
        guns.smg.get(Infinity)
        guns.pistol.get(Infinity)
        guns.minigun.get(Infinity)
        guns.missiles.get(Infinity)
        guns.grenadeLauncher.get(Infinity)
    }
}