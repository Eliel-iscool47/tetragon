const input = {
    pressedKeys: [],
    toggleCooldown: 0,
    paused: 0,
    gunL: 0,
    gunR: 0,
    test: 0,
    keybinds: {
        up: 'KeyW',
        down: 'KeyS',
        left: 'KeyA',
        right: 'KeyD',
        fire: 'KeyF',
        testing: 'KeyT',
        pause: 'KeyP',
        gunLeft: 'KeyQ',
        gunRight: 'KeyE',
        allGuns: 'KeyG',
        respawn: 'KeyR',
        reload: 'KeyV',
        mainMenu: 'KeyM',
        airStrike: 'KeyI',
    },
    cursor: {
        x: collisions.center.x,
        y: collisions.center.y,
        angle: utils.angle(this.x, this.y, player.pos.x, player.pos.y),
        update(posX, posY) {
            this.x = posX
            this.y = posY
            if (!simulation.isPaused) this.angle = utils.angle(this.x, this.y, player.pos.x, player.pos.y)
        }
    },
    up() {
        if (!simulation.isPaused) player.pos.y -= player.velocity
    },
    down() {
        if (!simulation.isPaused) player.pos.y += player.velocity
    },
    left() {
        if (!simulation.isPaused) player.pos.x -= player.velocity
    },
    right() {
        if (!simulation.isPaused) player.pos.x += player.velocity
    },
    fire() {
        if (utils.isNullish(guns.equippedGun)) {
            simulation.log('guns.equippedGun == undefined')
            return undefined
        }
        if (simulation.isPaused) return undefined
        if (!simulation.isTesting && guns.equippedGun.ammo > 0 && simulation.time - guns.lastBulletShot < 1 / guns.equippedGun.fireRate) return undefined
        guns.equippedGun.shoot()
        if (guns.equippedGun.isMuzzleFlash) bullets.muzzleFlash()
        guns.lastBulletShot = simulation.time
    },
    rightClick() {
        simulation.log('right click')
    },
    gunLeft() {
        if (simulation.absTime - this.gunL >= this.toggleCooldown) {
            this.gunL = simulation.absTime
            guns.equippedGun = guns.inventory.at((guns.inventory.indexOf(guns.equippedGun) - 1) % guns.inventory.length)
        }
    },
    gunRight() {
        if (simulation.absTime - this.gunR >= this.toggleCooldown) {
            this.gunR = simulation.absTime
            guns.equippedGun = guns.inventory.at((guns.inventory.indexOf(guns.equippedGun) + 1) % guns.inventory.length)
        }
    },
    reload() {
        if (!utils.isNullish(guns.equippedGun)) guns.equippedGun.reload()
    },
    allGuns() {
        if (simulation.isTesting) guns.allGuns()
    },
    respawn() {
        simulation.isPaused = false
        simulation.isDead = false
        simulation.isTesting = false
        simulation.time = 0
        player.pos.x = collisions.center.x
        player.pos.y = collisions.center.y
        player.maxHealth = 100
        player.health = player.maxHealth
        mobs.list = []
        level.current = 0
        level.time = 0
        bullets.list = []
        bullets.explosions = []
        powerUps.list = []
        guns.inventory = []
        guns.equippedGun = undefined
        simulation.timeOffset = utils.now()
        simulation.startTime = utils.now()
        simulation.isMainMenu = false
        simulation.isDead = false
        player.pos.x = collisions.center.x
        player.pos.y = collisions.center.y
        player.maxHealth = 100
        player.health = player.maxHealth
    },
    testing() {
        if (simulation.absTime - this.paused >= this.toggleCooldown) {
            simulation.isTesting = !simulation.isTesting
            this.paused = simulation.absTime
        }
    },
    pause() {
        if (simulation.absTime - this.paused >= this.toggleCooldown) {
            simulation.isPaused = !simulation.isPaused
            this.paused = simulation.absTime
        }
    },
    mainMenu() {
        if (!simulation.isMainMenu) simulation.mainMenu()
    },
    clickLogic(click) {
        this.cursor.update(click.offsetX, click.offsetY)
        this.fire()
    },
    keyToggleLogic() {
        this.pressedKeys.forEach(key => {
            switch(key) {
                case this.keybinds.gunLeft:
                    if (this.gunL + simulation.time < this.toggleCooldown) return undefined
                    this.gunL = simulation.time
                    this.gunLeft()
                    break
                case this.keybinds.gunRight:
                    if (this.gunR + simulation.time < this.toggleCooldown) return undefined
                    this.gunR = simulation.time
                    this.gunRight()
                    break
                case this.keybinds.testing:
                    if (this.test + simulation.time < this.toggleCooldown) return undefined
                    this.test = simulation.time
                    this.testing()
                    break
                case this.keybinds.pause:
                    this.pause()
                    break
            }
        })
    },
    keyLogic() {
        this.pressedKeys.forEach(key => {
            switch (key) {
                case this.keybinds.up:
                    this.up()
                    break
                case 'ArrowUp':
                    this.up()
                    break
                case this.keybinds.down:
                    this.down()
                    break
                case 'ArrowDown':
                    this.down()
                    break
                case this.keybinds.left:
                    this.left()
                    break
                case 'ArrowLeft':
                    this.left()
                    break
                case this.keybinds.right:
                    this.right()
                    break
                case 'ArrowRight':
                    this.right()
                    break
                case this.keybinds.fire:
                    this.fire()
                    break
                case this.keybinds.respawn:
                    this.respawn()
                    break
                case this.keybinds.reload:
                    this.reload()
                    break
                case this.keybinds.allGuns:
                    this.allGuns()
                    break
                case this.keybinds.mainMenu:
                    if (simulation.isDead || simulation.isPaused) this.mainMenu()
                    break
                default:
                    break
            }
        })
        this.cursor.angle = utils.angle(this.cursor.x, this.cursor.y, player.pos.x, player.pos.y)
    }
}
//actually handling input
window.addEventListener('resize', () => {
    main.width = window.innerWidth
    main.height = window.innerHeight
    collisions.border.right = main.width - player.size / 2
    collisions.border.bottom = main.height - player.size / 2
})
main.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    input.rightClick()
})
main.addEventListener('click', (click) => {
    input.clickLogic(click)
})
main.addEventListener('mousemove', (e) => {
    input.cursor.update(e.offsetX, e.offsetY)
})
document.addEventListener('keydown', (e) => {
    if (input.pressedKeys.includes(e.code)) return undefined
    input.pressedKeys.push(e.code)
    input.ketToggleLogic()
    if (simulation.isMainMenu || simulation.isTesting) console.log(e.code)
})
document.addEventListener('keyup', (e) => {
    if (input.pressedKeys.includes(e.code)) input.pressedKeys.splice(input.pressedKeys.indexOf(e.code), 1)

})
