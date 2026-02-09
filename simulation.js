const simulation = {
    isDead: false,
    isPaused: false,
    isTesting: false,
    timeOffset: utils.now(),
    startTime: utils.now(),
    time: 0,
    isMainMenu: false,
    frameRate: 200,
    crosshairColor: 'black',
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
        this.isPaused = false
        this.isDead = false
        this.isTesting = false
        this.time = 0
        player.pos.long = collisions.center.x
        player.pos.lat = collisions.center.y
        player.maxHealth = 100
        player.health = player.maxHealth
        mobs.list = []
        bullets.list = []
    },
    gameLoop() {
        draw.clearRect(0, 0, main.width, main.height)
        if (this.isMainMenu) {
            this.mainMenu()
        } else {
            if (player.health <= 0) player.kill()
            else {
                if (this.isDead) player.deathScreen()
                else {
                    if (this.isPaused) this.timeOffset = utils.now() - this.time
                    this.time = utils.now() - this.timeOffset
                    player.draw(player.pos.long, player.pos.lat)
                    mobs.drawMobs()
                    if (!this.isPaused) {
                        bullets.move()
                        mobs.move()
                    }
                    bullets.drawBullets()
                    bullets.kill()
                    bullets.killExplosions()
                    bullets.drawExplosions()
                    if (this.isTesting) this.crosshairColor = 'hsl(40,100%,50%)'
                    else this.crosshairColor = 'black'
                    hud.draw()
                    collisions.playerCollisions()
                    collisions.mobs()
                }
            }
        }
        this.crosshair(10)
    },
}
simulation.gameLoop()
setInterval(() => {
    simulation.gameLoop()
}, 1000 / simulation.frameRate)