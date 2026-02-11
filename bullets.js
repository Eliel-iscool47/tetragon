const bullets = {
    explosionDuration: 0.3,
    explosionSize: 20,
    duration: 1,
    list: [],
    explosions: [],
    grenade(x, y) {
        this.list.push({
            pos: {
                x: x,
                y: y
            },
            angle: Math.atan2(input.cursor.y - y, input.cursor.x - x),
            speed: 10,
            timeSpawned: simulation.time,
            isHoming: false,
            isExplode: true,
            origin: guns.grenadeLauncher,
        })
    },
    missile(x, y) {
        bullets.list.push({
            pos: {
                x: x,
                y: y,
            },
            angle: input.cursor.angle,
            speed: 10,
            timeSpawned: simulation.time,
            isHoming: true,
            isExplode: true,
            origin: guns.missiles,
        })
    },
    explosion(x, y, size) {
        this.explosions.push({
            pos: {
                x: x,
                y: y
            },
            size: size * this.explosionSize,
            time: simulation.time
        })
    },
    drawExplosions() {
        this.explosions.forEach(xpl => {
            draw.beginPath()
            draw.fillStyle = 'hsl(25, 100%, 50%)'
            draw.arc(xpl.pos.x, xpl.pos.y, xpl.size / 2, 0, Math.PI * 2)
            draw.fill()
        })
    },
    kill() {
        this.list.forEach(bullet => {
            if (bullet.timeSpawned < simulation.time - this.duration * bullet.origin.bulletDuration) {
                if (bullet.isExplode) this.explosion(bullet.pos.x, bullet.pos.y, 2)
                this.list.splice(this.list.indexOf(bullet), 1)
            }
        })
    },
    killExplosions() {
        this.explosions.forEach(xpl => {
            if (xpl.time + this.explosionDuration < simulation.time) this.explosions.splice(this.explosions.indexOf(xpl), 1)
        })
    },
    muzzleFlash() {
        draw.beginPath()
        draw.fillStyle = 'hsl(30, 100%, 50%)'
        draw.arc(player.pos.x + (Math.cos(input.cursor.angle) * player.size / 2), player.pos.y + (Math.sin(input.cursor.angle) * player.size / 2), player.size * 0.2, 0, Math.PI * 2)
        draw.fill()
    },
    move() {
        this.list.forEach(bullet => {
            if (bullet.isHoming) {
                bullet.angle = Math.atan2(input.cursor.y - bullet.pos.y, input.cursor.x - bullet.pos.x)
            }
            bullet.pos.x += Math.cos(bullet.angle) * bullet.speed
            bullet.pos.y += Math.sin(bullet.angle) * bullet.speed
        })
    },
    drawBullets() {
        this.list.forEach(bullet => {
            draw.save()
            draw.beginPath()
            draw.translate(bullet.pos.x, bullet.pos.y)
            draw.rotate(bullet.angle)
            switch (bullet.origin) {
                case guns.pistol:
                    draw.fillStyle = 'black'
                    draw.fillRect(-5, -2, 10, 4)
                    break
                case guns.sniper:
                    draw.fillStyle = 'hsl(0, 100%, 35%)'
                    draw.fillRect(-5, -2, 15, 5)
                    break
                case guns.rifle:
                    draw.fillStyle = 'hsl(0, 100%, 50%)'
                    draw.beginPath()
                    draw.fillRect(-5, -2, 10, 4)
                    draw.arc(5, 0, 2, 0, Math.PI * 2)
                    draw.fill()
                    break
                case guns.shotgun:
                    draw.fillStyle = 'hsl(30, 100%, 50%)'
                    draw.fillRect(-3, -3, 6, 6)
                    break
                case guns.smg:
                    draw.fillStyle = 'hsl(0, 100%, 50%)'
                    draw.beginPath()
                    draw.arc(0, 0, 5, 0, Math.PI * 2)
                    draw.fill()
                    break
                case guns.miniGun:
                    draw.fillStyle = 'hsl(0, 100%, 20%)'
                    draw.beginPath()
                    draw.arc(0, 0, 5, 0, Math.PI * 2)
                    draw.fill()
                    break
                case guns.missiles:
                    draw.fillStyle = 'hsl(0, 0%, 60%)'
                    draw.fillRect(-15, -5, 30, 10)
                    break
                case guns.grenadeLauncher:
                    draw.fillStyle = 'hsl(110, 100%, 30%)'
                    draw.arc(0, 0, 8, 0, Math.PI * 2)
                    draw.fill()
                    break
                default:
                    console.error('bullet.origin == undefined')
                    break
            }
            draw.restore()
        })
    }
}