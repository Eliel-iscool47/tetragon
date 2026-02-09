const input = {
    pressedKeys: [],
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
        angle: Math.atan2(this.y - player.pos.lat, this.x - player.pos.long),
        update(posX, posY) {
            this.x = posX
            this.y = posY
            if (!simulation.isPaused) this.angle = Math.atan2(this.y - player.pos.lat, this.x - player.pos.long)
        }
    },
    up() {
        if (!simulation.isPaused) player.pos.lat -= player.velocity
    },
    down() {
        if (!simulation.isPaused) player.pos.lat += player.velocity
    },
    left() {
        if (!simulation.isPaused) player.pos.long -= player.velocity
    },
    right() {
        if (!simulation.isPaused) player.pos.long += player.velocity
    },
    fire() {
        if (simulation.isDead) return undefined
        if (simulation.isMainMenu) return undefined
        if (utils.isNullish(guns.equippedGun)) {
            console.log('guns.equippedGun == undefined')
            return undefined
        }
        if (simulation.isPaused) return undefined
        //make the equipped gun unable to shoot if the last bulllet shot was shot before 1/the gun's fire rate
        if (!simulation.isTesting && simulation.time - guns.lastBulletShot < 1 / guns.equippedGun.fireRate) return undefined
        if (guns.equippedGun == guns.rifle || guns.equippedGun == guns.minigun || guns.equippedGun == guns.sniper || guns.equippedGun == guns.smg || guns.equippedGun == guns.pistol || guns.equippedGun == guns.shotgun) bullets.muzzleFlash()
        guns.equippedGun.shoot()
        guns.lastBulletShot = simulation.time
    },
    airStrike() {
        if (simulation.isPaused) return undefined
        guns.airStrike()
    },
    rightClick() {
        console.log('right click')
    },
    gunLeft() {
        guns.equippedGun = guns.inventory.at((guns.inventory.indexOf(guns.equippedGun) - 1) % guns.inventory.length)
    },
    gunRight() {
        guns.equippedGun = guns.inventory.at((guns.inventory.indexOf(guns.equippedGun) + 1) % guns.inventory.length)
    },
    reload() {
        if (!utils.isNullish(guns.equippedGun)) guns.equippedGun.reload()
    },
    allGuns() {
        guns.allGuns()
    },
    respawn() {
        simulation.wipe()
        guns.equippedGun = undefined
        guns.inventory = []
        simulation.timeOffset = utils.now()
    },
    testing() {
    },
    mainMenu() {
        if (!simulation.isMainMenu) simulation.mainMenu()
    },
    clickLogic(click) {
        this.cursor.update(click.offsetX, click.offsetY)
        this.fire()
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
                case this.keybinds.gunLeft:
                    this.gunLeft()
                    break
                case this.keybinds.gunRight:
                    this.gunRight()
                    break
                case this.keybinds.testing:
                    if (simulation.isTesting) simulation.exitTest()
                    else simulation.test()
                    break
                case this.keybinds.pause:
                    if (simulation.isPaused) simulation.resume()
                    else simulation.pause()
                    break
                case this.keybinds.heal:
                    this.heal()
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
                case this.keybinds.airStrike:
                    this.airStrike()
                    break
                case this.keybinds.mainMenu:
                    if (simulation.isDead || simulation.isPaused) this.mainMenu()
                    break
                default:
                    break
            }
        })
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
    if (!input.pressedKeys.includes(e.code)) input.pressedKeys.push(e.code)
    input.keyLogic()
    if (simulation.isMainMenu || simulation.isTesting) console.log(e.code)
})
document.addEventListener('keyup', (e) => {
    if (input.pressedKeys.includes(e.code)) input.pressedKeys.splice(input.pressedKeys.indexOf(e.code), 1)
})