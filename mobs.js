const mobs = {
    maxHealth: 1,
    damage: 1,
    damageTaken: 0,
    list: [],
    spawn: {
        default(x, y) {
            mobs.list.push({
                type: 'default',
                pos: {
                    x: x,
                    y: y
                },
                health: 1,
                damage: 1,
                speed: 1,
                color: 'hsl(150, 100%, 50%)',
            })
        },
        runner(x, y) {
            mobs.list.push({
                type: 'runner',
                pos: {
                    x: x,
                    y: y
                },
                health: 1,
                damage: 1,
                color: 'red',
            })
        },
    },
    colorMobs() {
        this.list.forEach(mob => {
            switch (mob.type) {
                case 'default':
                    mob.color = 'hsl(150, 100%, 50%)'
                    break
                case 'runner':
                    mob.color = 'red'
                    break
                default:
                    throw new Error('invalid mob type')
            }
        })
    },
    drawMobs() {
        this.list.forEach(mob => {
            draw.fillStyle = mob.color
            switch (mob.type) {
                case 'default':
                    draw.fillRect(mob.pos.x - 10, mob.pos.y - 10, 20, 20)
                    break
                case 'runner':
                    draw.beginPath()
                    draw.arc(mob.pos.x, mob.pos.y, 10, 0, Math.PI * 2)
                    draw.fill()
                    break
                default:
                    throw new Error('invalid mob type')
            }
        })
    },
    move() {
        this.list.forEach(mob => {
            switch (mob.type) {
                case 'default':
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.lat, mob.pos.x - player.pos.long)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.lat, mob.pos.x - player.pos.long)) * mob.speed
                    break
                case 'runner':
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.lat, mob.pos.x - player.pos.long)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.lat, mob.pos.x - player.pos.long)) * mob.speed
                    break
                default:
                    break
            }
        })
    }
}