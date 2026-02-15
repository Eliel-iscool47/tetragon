const player = {
    health: 100,
    maxHealth: 100,
    damageDone: 1,
    damageTaken: 1,
    isInvulnerable: false,
    size: 50,
    velocity: 5,
    ammo: 50,
    deathMessage: 'You died',
    color: 'hsl(215, 100%, 50%)',
    pos: {
        x: main.width / 2,
        y: main.height / 2,
    },
    dealDamage(dmg) {
        if (this.isInvulnerable || simulation.isTesting) return undefined
        this.health -= dmg * this.damageTaken
        this.setInvulnerable(0.1)
    },
    setInvulnerable(duration) {
        this.isInvulnerable = true
        setTimeout(() => {
            this.isInvulnerable = false
        }, duration * 1000)
    },
    deathScreen() {
        draw.fillStyle = 'hsl(0, 100%, 30%)'
        draw.fillRect(0, 0, main.width, main.height)
        draw.fillStyle = 'hsl(0, 0%, 0%)'
        draw.font = `${(main.width + main.height) / 10}px Consolas`
        draw.textAlign = 'center'
        draw.fillText('You died', main.width / 2, main.height / 2)
        draw.font = `${(main.width + main.height) / 25}px Consolas`
        draw.fillText(`press ${input.keybinds.respawn.replace('Key', '').replace('Digit', '')} to respawn`, main.width / 2, main.height / 2 + 75, main.width)
        document.title = 'Tetragon: Game Over'
    },
    kill() {
        this.health = 0
        simulation.isDead = true
    },
    reload() {
    },
    draw(x, y) {
        draw.save()
        draw.translate(x, y)
        draw.fillStyle = this.color
        draw.fillRect(this.size / -2, this.size / -2, this.size, this.size)
        draw.strokeStyle = 'white'
        draw.lineWidth = this.size / 10
        if (
            input.cursor.angle < Math.PI / -2 ||
            input.cursor.angle > Math.PI / 2)
            draw.drawImage(sprites.commanderHat.left, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)
        else draw.drawImage(sprites.commanderHat.right, this.size * -0.6, this.size * -1.2, this.size * 1.2, this.size * 0.6)
        draw.rotate(input.cursor.angle)
        draw.beginPath()
        draw.arc(0, 0, this.size * 0.3, Math.PI * -2, 0)
        draw.stroke()
        draw.beginPath()
        draw.moveTo(Math.cos(utils.angle(0, 0, this.size, 0) * this.size * 0.3), Math.sin(utils.angle(0, 0, this.size, 0)) * this.size * 0.3)
        draw.lineTo(this.size * 0.3, 0)
        draw.stroke()
        draw.restore()
    },
}