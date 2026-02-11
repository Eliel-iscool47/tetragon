const hud = {
    timeMessage: ``,
    healthBar() {
        draw.fillStyle = 'hsl(0, 0%, 50%)'
        draw.fillRect(0, 10, player.maxHealth * 2, 40)
        draw.fillStyle = `hsl(${Math.min(player.health * 1.2, 200)}, 100%, 50%)`
        draw.fillRect(0, 10, player.health * 2, 40)
        draw.fillStyle = 'black'
        draw.font = '20px Consolas'
        draw.textAlign = 'left'
        draw.fillText(`${Math.round(player.health)} / ${Math.round(player.maxHealth)}`, 10, 40)
    },
    damageTakenBar() {
        if (player.damageTaken <= 1) draw.fillStyle = 'hsl(220, 100%, 80%)'
        else draw.fillStyle = 'hsl(0, 100%, 65%)'
        draw.fillRect(0, 0, (1 - player.damageTaken) * 200, 10)
    },
    damageBar() {
        draw.fillStyle = 'hsl(0, 100%, 40%)'
        draw.fillRect(main.width - 12, 0, 20, player.damage * 150)
    },
    upgradeList() {
        draw.fillStyle = 'hsl(0, 0%, 70%)'
        draw.fillRect(main.width * 0.9, 0, main.width * 0.1, main.height * 0.4)
        
    },
    inventory() {
        draw.fillStyle = 'hsl(0, 0%, 70%)'
        draw.fillRect(0, 55, 200, guns.inventory.length * 30 + 30)
        draw.fillStyle = 'black'
        draw.font = '20px Consolas'
        draw.textAlign = 'left'
        draw.fillText('Inventory', 40, 70)
        guns.inventory.forEach((gun, index) => {
            index++
            if (gun == guns.equippedGun) draw.fillStyle = 'hsl(210, 100%, 50%)'
            else draw.fillStyle = 'black'
            draw.font = '20px Consolas'
            draw.textAlign = 'left'
            draw.fillText(`${gun.name}: ${`${(gun.ammo + (gun.magazines * gun.magSize))}`.replaceAll('Infinity', '∞')}`, 10, 70 + index * 30)
        })
    },
    elapsedTime() {
        draw.fillStyle = 'hsl(0, 0%, 60%)'
        draw.fillRect(0, main.height - 50, 200, 40)
        draw.font = '20px Consolas'
        draw.textAlign = 'left'
        draw.fillStyle = 'black'
        switch (true) {
            case simulation.time < 60:
                this.timeMessage = `${simulation.time.toFixed(1)}s`
                break
            case simulation.time < 3600:
                this.timeMessage = `${Math.floor(simulation.time / 60)}m ${(simulation.time % 60).toFixed(1)}s`
                break
            default:
                this.timeMessage = `${Math.floor(simulation.time / 3600)}h ${Math.floor((simulation.time % 3600) / 1)}m ${Math.round(simulation.time % 60)}s`
                break
        }
        draw.fillText(this.timeMessage, 10, main.height - 25)
    },
    make() {
        this.healthBar()
        this.damageTakenBar()
        this.damageBar()
        this.inventory()
        this.elapsedTime()
        this.upgradeList()
    }
}