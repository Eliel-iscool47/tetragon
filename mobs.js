const mobs = {
    maxHealth: 1,
    damage: 1,
    damageTaken: 0,
    list: [],
    drawMobs() {
        this.list.forEach(mob => {
            draw.fillStyle = mob.color
            draw.save()
            draw.translate(mob.pos.x, mob.pos.y)
            draw.rotate(mob.angle)
            switch (mob.type) {
                case 'default':
                    draw.fillRect(-10, -10, mob.size, mob.size)
                    break
                case 'runner':
                    draw.beginPath()
                    draw.arc(0, 0, mob.size / 2, 0, Math.PI * 2)
                    draw.fill()
                    break
                case 'tank':
                    draw.fillRect(-10, -10, mob.size, mob.size)
                    break
                case 'archer':
                    draw.beginPath()
                    draw.arc(0, 0, mob.size / 2, 0, Math.PI * 2)
                    draw.fill()
                    break
                case 'arrow':
                    draw.fillRect(mob.size * -0.5, mob.size * -5, mob.size * 5, mob.size * 0.5)
                    break
                default:
                    throw new Error('invalid mob type')

            }
            draw.restore()
        })
    },
    logic() {
        this.list.forEach(mob => {
            switch (mob.type) {
                case 'default':
                    mob.angle = utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)
                    mob.pos.x -= Math.cos(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    mob.pos.y -= Math.sin(Math.atan2(mob.pos.y - player.pos.y, mob.pos.x - player.pos.x)) * mob.speed
                    break
                case 'runner':
                    mob.angle = utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)
                    mob.pos.x -= Math.cos(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                    mob.pos.y -= Math.sin(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                    break
                case 'tank':
                    mob.angle = utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)
                    mob.pos.x -= Math.cos(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                    mob.pos.y -= Math.sin(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                    break
                case 'archer':
                    mob.angle = utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)
                    if (simulation.time - mob.timeSinceLastAttack > 1) {
                        spawn.arrow(mob.pos.x, mob.pos.y)
                        mob.timeSinceLastAttack = simulation.time
                    } 
                    if (utils.distance(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y) > mob.size * 15) {
                        mob.pos.x -= Math.cos(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                        mob.pos.y -= Math.sin(utils.angle(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y)) * mob.speed
                    }
                    break
                case 'arrow':
                    mob.pos.x -= Math.cos(mob.angle) * mob.speed
                    mob.pos.y -= Math.sin(mob.angle) * mob.speed
                    break
                default:
                    break
            }
        })
    }
}