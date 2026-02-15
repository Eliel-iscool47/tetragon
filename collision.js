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
    players() {
        player.pos.x = utils.clamp(player.pos.x, collisions.border.left, collisions.border.right)
        player.pos.y = utils.clamp(player.pos.y, collisions.border.top, collisions.border.bottom)
        if (simulation.isPaused) return undefined
        mobs.list.forEach(mob => {
            if (utils.distance(player.pos.x, player.pos.y, mob.pos.x, mob.pos.y) < player.size / 2 && simulation.time - mob.timeSinceLastAttack > mob.attackCooldown) {
                player.dealDamage(mob.damage)
                if (mob.attackType == 'melee') mob.timeSinceLastAttack = simulation.time
            }
        })
    },
    mobs() {
        mobs.list.forEach(mob => {
            if (mob.health <= 0 ||
                mob.pos.x < collisions.border.left ||
                mob.pos.x > collisions.border.right ||
                mob.pos.y < collisions.border.top ||
                mob.pos.y > collisions.border.bottom
            ) mobs.list.splice(mobs.list.indexOf(mob), 1)
            bullets.list.forEach(bullet => {
                if (utils.distance(mob.pos.x, mob.pos.y, bullet.pos.x, bullet.pos.y) > mob.size) return undefined
                if (bullet.isExplode) bullets.explosion(bullet.pos.x, bullet.pos.y, 2)
                mob.health -= guns.equippedGun.damage * player.damageDone
                bullets.list.splice(bullets.list.indexOf(bullet), 1)
            })
            bullets.explosions.forEach(xpl => {
                if (utils.distance(mob.pos.x, mob.pos.y, xpl.pos.x, xpl.pos.y) <= mob.size) mob.health -= 5
            })
        })
    }
}