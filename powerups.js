const powerUps = {
    list: [],
    gun: {
        name: 'gun',
        color: 'hsl(220, 100%, 35%)',
        new(x, y) {
            powerUps.list.push({
                pos: {
                    x: x,
                    y: y
                },
                color: this.color,
                effect() {
                    powerUps.gun.effect()
                    powerUps.list.splice(powerUps.list.indexOf(this), 1)
                },
                type: 'gun',
            })
        },
        effect() {
            guns.random(30)
        }
    },
    heal: {
        name: 'heal',
        color: 'hsl(120, 100%, 40%)',
        new(x, y) {
            powerUps.list.push({
                pos: {
                    x: x,
                    y: y
                },
                color: this.color,
                effect() {
                    powerUps.heal.effect()
                    powerUps.list.splice(powerUps.list.indexOf(this), 1)
                },
                type: 'heal',
            })
        },
        effect() {
            player.health += 5
        }
    },
    ammo: {
        name: 'ammo',
        color: 'hsl(230, 100%, 15%)',
        new(x, y) {
            powerUps.list.push({
                pos: {
                    x: x,
                    y: y
                },
                color: this.color,
                effect() {
                    guns.inventory.forEach(gun => {
                        gun.magazines += 5
                    })
                    powerUps.list.splice(powerUps.list.indexOf(this), 1)
                },
                type: 'ammo',
            })
        },
        effect() {
            guns.equippedGun.ammo += 10
        }
    },
    draw() {
        powerUps.list.forEach(p => {
            draw.fillStyle = p.color
            this.draw.strokeStyle = 'black'
            draw.beginPath()
            draw.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2)
            draw.fill()
            draw.beginPath()
            draw.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2)
            draw.stroke()
        })
    }
}