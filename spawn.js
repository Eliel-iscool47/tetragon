const spawn = {
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
            speed: 3,
            angle: 0,
            timeSinceLastAttack: 0,
            attackCooldown: 0.5,
            attackType: 'melee',
            color: 'hsl(100, 100%, 45%)',
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
            speed: 8,
            angle: 0,
            timeSinceLastAttack: 0,
            attackCooldown: 2,
            attackType: 'melee',
            color: 'hsl(0, 100%, 50%)',
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
            speed: 2,
            angle: 0,
            timeSinceLastAttack: 0,
            attackCooldown: 0.7,
            attackType: 'melee',
            color: 'hsl(190, 100%, 35%)',
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
            speed: 5,
            angle: 0,
            timeSinceLastAttack: 0,
            attackCooldown: 1,
            attackType: 'ranged',
            color: 'hsl(300, 100%, 50%)',
        })
    },
    arrow(x, y) {
        mobs.list.push({
            type: 'arrow',
            pos: {
                x: x,
                y: y
            },
            health: 1,
            damage: 1,
            damageTaken: 1,
            size: 5,
            speed: 8,
            angle: utils.angle(x, y, player.pos.x, player.pos.y),
            timeSinceLastAttack: 0,
            attackCooldown: 0.2,
            attackType: 'melee',
            color: 'hsl(0, 0%, 0%)',
        })
    },
}