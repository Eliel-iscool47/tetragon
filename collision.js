const collisions = {
    center: {
        x: main.width / 2,
        y: main.height / 2,
    },
    border: {
        left: 25,
        right: main.width - player.size / 2,
        top: 25,
        bottom: main.height - player.size / 2,
    },
    playerCollisions() {
        if (simulation.isPaused) return undefined
        mobs.list.forEach(mob => {
            if (utils.distance(player.pos.x, player.pos.y, mob.pos.x, mob.pos.y) < player.size / 2) player.dealDamage(mob.damage)
            
        })
        powerUps.list.forEach(p => {
            if (utils.distance(player.pos.x, player.pos.y, p.pos.x, p.pos.y) < player.size / 2) {
                p.effect()
            }
        })
    },
    mobs() {
        mobs.list.forEach(mob => {
            if (mob.health <= 0) mobs.list.splice(mobs.list.indexOf(mob), 1)
            bullets.list.forEach(bullet => {
                if (utils.distance(mob.pos.x, mob.pos.y, bullet.pos.x, bullet.pos.y) > mob.size) return undefined
                if (bullet.isExplode) bullets.explosion(bullet.pos.x, bullet.pos.y)
                mob.health -= guns.equippedGun.damage
                bullets.list.splice(bullets.list.indexOf(bullet), 1)
            })
            bullets.explosions.forEach(xpl => {
                if (utils.distance(mob.pos.x, mob.pos.y, xpl.pos.x, xpl.pos.y) > mob.size) return undefined
                mob.health -= 5
                bullets.explosions.splice(bullets.explosions.indexOf(xpl), 1)
            })
        })
    }
}