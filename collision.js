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
        if (!simulation.isPaused) mobs.list.forEach(mob => {
            if (utils.distance(player.pos.long, player.pos.lat, mob.pos.x, mob.pos.y) < player.size / 2 && utils.distance(player.pos.long, player.pos.lat, mob.pos.x, mob.pos.y) < player.size / 2) {
                player.health -= mob.damage * player.damageTaken
            }
        })
    },
    mobs() {
        mobs.list.forEach(mob => {
            if (mob.health <= 0) mobs.list.splice(mobs.list.indexOf(mob), 1)
            bullets.list.forEach(bullet => {
                if (Math.abs(mob.pos.x - bullet.pos.x) < 10 && Math.abs(mob.pos.y - bullet.pos.y) < 10) {

                    mob.health -= guns.equippedGun.damage
                    bullets.list.splice(bullets.list.indexOf(bullet), 1)
                }
            })
        })
    }
}