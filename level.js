const level = {
    intermission: 10,
    time: 0,
    current: 1,
    new() {
        switch (true) {
            case this.current <= 1:
                mobs.spawn.default(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                powerUps.gun.new(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                break
            case this.current <= 5:
                for (let index = 0; index < 5; index++) {
                    mobs.spawn.default(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                }
                break
            case this.current <= 10:
                for (let index = 0; index < 10; index++) {
                    mobs.spawn.default(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                }
                mobs.spawn.runner(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                mobs.spawn.runner(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                break
            case this.current <= 20:
                for (let index = 0; index < 8; index++) {
                    mobs.spawn.runner(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                    mobs.spawn.tank(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                }
                break
            default:
                for (let index = 0; index < 10; index++) {
                    mobs.spawn.default(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                    mobs.spawn.runner(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                    mobs.spawn.tank(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
                }
                break
        }
        for (let index = 0; index < 3; index++) {
            powerUps.ammo.new(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
            powerUps.heal.new(utils.randomInt(collisions.border.left, collisions.border.right), utils.randomInt(collisions.border.top, collisions.border.bottom))
        }
    },
    next() {
        this.current++
    },
    prev() {
        this.current--
    }
}