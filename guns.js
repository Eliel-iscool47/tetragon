const guns = {
    inventory: [],
    equippedGun: undefined,
    lastBulletShot: (-10) ** 299,
    rifle: {
        name: 'rifle',
        ammo: 30,
        magSize: 30,
        magazines: 3,
        damage: 1.5,
        fireRate: 20,
        bulletDuration: 1,
        spread: 0,
        isMuzzleFlash: true,
        get(mags) {
            if (guns.inventory.includes(this)) return undefined
            this.ammo = mags * this.magSize
            guns.inventory.push(this)
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.list.push({
                pos: {
                    x: player.pos.x + (Math.cos(Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x)) * player.size / 2),
                    y: player.pos.y + (Math.sin(Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x)) * player.size / 2),
                },
                angle: Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x),
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
        damage: 1,
        fireRate: 2.5,
        bulletDuration: 0.5,
        spread: 30,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            for (
                let index = 0;
                index < 20;
                index++
            ) {
                bullets.list.push({
                    pos: {
                        x: player.pos.x + (Math.cos(input.cursor.angle) * player.size / 2),
                        y: player.pos.y + (Math.sin(input.cursor.angle) * player.size / 2),
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
        magSize: 3,
        magazines: 3,
        damage: 8,
        bulletDuration: 4,
        fireRate: 1.3,
        spread: 0,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.list.push({
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                },
                angle: Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x),
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
        ammo: 50,
        magSize: 50,
        magazines: 2,
        damage: 1.2,
        fireRate: 35,
        bulletDuration: 1,
        spread: 0,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.list.push({
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                },
                angle: Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x),
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
        ammo: 10,
        magSize: 10,
        magazines: 5,
        damage: 1.4,
        fireRate: 6,
        bulletDuration: 1,
        spread: 0,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.list.push({
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
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
    miniGun: {
        name: 'minigun',
        ammo: 300,
        magSize: 300,
        magazines: 0,
        damage: 0.1,
        fireRate: 100,
        bulletDuration: 1,
        spread: 0,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.list.push({
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                },
                angle: Math.atan2(input.cursor.y - player.pos.y, input.cursor.x - player.pos.x),
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
        magazines: 10,
        damage: 1.3,
        fireRate: 2,
        bulletDuration: 1.5,
        spread: 0,
        isMuzzleFlash: true,
        get(mags) {
            if (guns.inventory.includes(this)) return undefined
            guns.inventory.push(this)
            this.magazines = mags
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            this.lastBullet = simulation.time
        }
    },
    missiles: {
        name: 'missiles',
        ammo: 1,
        magSize: 1,
        magazines: 50,
        damage: 1,
        fireRate: 1.4,
        bulletDuration: 10,
        spread: 0,
        isMuzzleFlash: true,
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
                simulation.log(`guns.${this.name}.ammo == 0`)
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
            bullets.missile(player.pos.x, player.pos.y)
            this.ammo--
            this.lastBullet = simulation.time
        }
    },
    allGuns() {
        guns.rifle.get(Infinity)
        guns.shotgun.get(Infinity)
        guns.sniper.get(Infinity)
        guns.smg.get(Infinity)
        guns.pistol.get(Infinity)
        guns.miniGun.get(Infinity)
        guns.missiles.get(Infinity)
        guns.grenadeLauncher.get(Infinity)
    },
    drawGun() {
        return undefined
    },
    random(mags) {
        if (this.inventory.length >= 8) return undefined
        switch (utils.randomInt(1, 8)) {
            case 1:
                if (this.inventory.includes(guns.rifle)) this.random(mags)
                else guns.rifle.get(mags)
                break
            case 2:
                if (this.inventory.includes(guns.shotgun)) this.random(mags)
                else guns.shotgun.get(mags)
                break
            case 3:
                if (this.inventory.includes(guns.sniper)) this.random(mags)
                else guns.sniper.get(mags)
                break
            case 4:
                if (this.inventory.includes(guns.smg)) this.random(mags)
                else guns.smg.get(mags)
                break
            case 5:
                if (this.inventory.includes(guns.pistol)) this.random(mags)
                else guns.pistol.get(mags * 0.5)
                break
            case 6:
                if (this.inventory.includes(guns.miniGun)) this.random(mags)
                else guns.miniGun.get(mags)
                break
            case 7:
                if (this.inventory.includes(guns.grenadeLauncher)) this.random(mags)
                else guns.grenadeLauncher.get(mags)
                break
            case 8:
                if (this.inventory.includes(guns.missiles)) this.random(mags)
                else guns.missiles.get(mags * 5)
                break
            default:
                document.location.href = 'error.html'
                break
        }
    }
}

