const player = {
    health: 100,
    maxHealth: 100,
    damage: 1,
    damageTaken: 1,
    isInvulnerable: false,
    size: 50,
    velocity: 10,
    ammo: 50,
    deathMessage: 'You died',
    color: 'hsl(220, 100%, 50%)',
    pos: {
        long: main.width / 2,
        lat: main.height / 2,
    },
    setInvulnerable(duration){
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
    },
    kill() {
        this.health = 0
        simulation.isDead = true
        this.deathScreen()
    },
    draw(longitude,latitude) {
        draw.save()
        draw.translate(longitude, latitude)
        draw.fillStyle = this.color
        draw.fillRect(this.size / -2, this.size / -2, this.size, this.size)
        draw.strokeStyle = 'white'
        draw.lineWidth = this.size / 10
        draw.drawImage(images.commanderHat, this.size / -2, this.size / -1, this.size * 1.2, this.size / 2)
        draw.rotate(input.cursor.angle)
        draw.beginPath()
        draw.arc(0, 0, this.size * 0.3, Math.PI * -2, 0)
        draw.stroke()
        draw.beginPath()
        draw.moveTo(Math.cos(utils.slope(0, 0, this.size, 0) * this.size * 0.3), Math.sin(utils.slope(0, 0, this.size, 0)) * this.size * 0.3)
        draw.lineTo(this.size * 0.3, 0)
        draw.stroke()
        draw.restore()
    },
}