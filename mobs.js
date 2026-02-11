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
                health: 5,
                damage: 5,
                damageTaken: 1,
                size: 20,
                speed: 1,
                attackType: 'melee',
                color: 'hsl(80, 100%, 50%)',
            })
        },
        runner(x, y) {
            mobs.list.push({
                type: 'runner',
                pos: {
                    x: x,
                    y: y
                },
                health: 3,
                damage: 2,
                damageTaken: 1.3,
                size: 20,
                speed: 3,
                attackType: 'melee',
                color: 'hsl(30, 100%, 50%)',
            })
        },
        tank(x, y) {
            mobs.list.push({
                type: 'tank',
                pos: {
                    x: x,
                    y: y
                },
                health: 25,
                damage: 15,
                damageTaken: 0.8,
                size: 20,
                speed: 0.4,
                attackType: 'melee',
                color: 'hsl(200, 100%, 50%)',
            })
        },
        archer(x, y) {
            mobs.list.push({
                type: 'archer',
                pos: {
                    x: x,
                    y: y
                },
                health: 5,
                damage: 5,
                damageTaken: 1,
                size: 20,
                speed: 1,
                attackType: 'ranged',
                color: 'hsl(80, 100%, 50%)',
            })
        },
    },
    drawMobs() {
        this.list.forEach(mob => {
            draw.fillStyle = mob.color
            switch (mob.type) {
                case 'default':
                    draw.fillRect(mob.pos.x - 10, mob.pos.y - 10, mob.size, mob.size)
                    break
                case 'runner':
                    draw.beginPath()
                    draw.arc(mob.pos.x, mob.pos.y, mob.size / 2, 0, Math.PI * 2)
                    draw.fill()
                    break
                case 'tank':
                    draw.fillRect(mob.pos.x - 10, mob.pos.y - 10, mob.size, mob.size)
                    break
                case 'archer':
                    draw.beginPath()
                    draw.arc(mob.pos.x, mob.pos.y, mob.size / 2, 0, Math.PI * 2)
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
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    break
                case 'runner':
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    break
                case 'tank':
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    break
                default:
                    break
            }
        })
    }
}