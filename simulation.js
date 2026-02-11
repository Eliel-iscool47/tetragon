const simulation = {
    consoleMsg: ``,
    isDead: false,
    isPaused: false,
    isTesting: false,
    timeOffset: utils.now(),
    absOffset: utils.now(),
    startTime: utils.now(),
    absTime: 0,
    time: 0,
    isMainMenu: false,
    frameRate: 200,
    crosshairColor: 'black',
    camera: {
        x: 0,
        y: 0,
    },
    log(msg) {
        this.consoleMsg = msg
    },
    pause() {
        this.isPaused = true
    },
    resume() {
        this.isPaused = false
    },
    test() {
        this.isTesting = true
    },
    exitTest() {
        this.isTesting = false
    },
    crosshair(size) {
        draw.strokeStyle = this.crosshairColor
        draw.lineWidth = 2
        draw.beginPath()
        draw.moveTo(input.cursor.x - size, input.cursor.y)
        draw.lineTo(input.cursor.x + size, input.cursor.y)
        draw.moveTo(input.cursor.x, input.cursor.y - size)
        draw.lineTo(input.cursor.x, input.cursor.y + size)
        draw.stroke()
    },
    mainMenu() {
        this.isMainMenu = true
        draw.save()
        draw.translate(collisions.center.x, collisions.center.y)
        this.isMainMenu = true
        draw.fillStyle = 'hsl(0, 0%, 70%)'
        draw.fillRect(main.width / -2, main.height / -2, main.width, main.height)
        draw.fillStyle = 'hsl(220, 100%, 50%)'
        draw.strokeStyle = 'hsl(220, 100%, 50%)'
        draw.lineWidth = 5
        draw.beginPath()
        draw.strokeRect(-140, -60, 280, 120)
        draw.fillStyle = 'hsl(220, 100%, 50%)'
        draw.font = '50px Consolas'
        draw.textAlign = 'center'
        draw.fillText('Tetragon', 0, 0)
        draw.font = '20px Consolas'
        draw.fillText(`press ${input.keybinds.respawn} to start`, 0, 30)
        draw.restore()
    },
    wipe() {
        level.current = 0
        level.time = 0
        this.isMainMenu = false
        this.isPaused = false
        this.isDead = false
        this.isTesting = false
        this.time = 0
        player.pos.x = collisions.center.x
        player.pos.y = collisions.center.y
        player.maxHealth = 100
        player.health = player.maxHealth
        mobs.list = []
        bullets.list = []
        bullets.explosions = []
        powerUps.list = []
        guns.inventory = []
        guns.equippedGun = undefined
    },
    gameLoop() {
        draw.clearRect(0, 0, main.width, main.height)
        input.keyLogic()
        if (this.isMainMenu) {
            this.mainMenu()
            main.style.cursor = 'default'
        } else {
            main.style.cursor = 'none'
            if (this.isDead) player.deathScreen()
            else {
                if (player.health <= 0) player.kill()
                else {
                    if (this.isPaused) this.timeOffset = utils.now() - this.time
                    this.time = utils.now() - this.timeOffset
                    this.absTime = utils.now() - this.absOffset
                    player.draw(player.pos.x, player.pos.y)
                    guns.drawGun()
                    mobs.drawMobs()
                    powerUps.draw()
                    if (mobs.list.length <= 0 && level.time - level.intermission < this.time) {
                        if (true) {
                            level.next()
                            level.new()
                            level.time = this.time
                        }
                    }
                    bullets.drawBullets()
                    bullets.kill()
                    bullets.drawExplosions()
                    bullets.killExplosions()
                    if (this.isTesting) this.crosshairColor = 'hsl(40,100%,50%)'
                    else this.crosshairColor = 'black'
                    hud.make()
                    collisions.playerCollisions()
                    collisions.mobs()
                    if (!this.isPaused) {
                        bullets.move()
                        mobs.move()
                    }
                }
            }
        }
        this.crosshair(10)
    },
}
guns.random(30)
simulation.gameLoop()
setInterval(() => {
    simulation.gameLoop()
}, 1000 / simulation.frameRate)