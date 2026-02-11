const sprites = {
    commanderHat: {
        left: new Image(),
        right: new Image(),
    },
    rifle: {
        left: new Image(),
        right: new Image(),
    },
    shotgun: {
        left: new Image(),
        right: new Image(),
    },
    sniper: {
        left: new Image(),
        right: new Image(),
    },
    smg: {
        left: new Image(),
        right: new Image(),
    },
    pistol: {
        left: new Image(),
        right: new Image(),
    },
    miniGun: {
        left: new Image(),
        right: new Image(),
    },
    grenadeLauncher: {
        left: new Image(),
        right: new Image(),
    },
    set() {
        this.commanderHat.left.src = './assets/commander_hat_left.png'
        this.commanderHat.right.src = './assets/commander_hat_right.png'
        this.rifle.left.src = './assets/guns/rifle_left.png'
        this.rifle.right.src = './assets/guns/rifle_right.png'
        this.shotgun.left.src = './assets/guns/shotgun_left.png'
        this.shotgun.right.src = './assets/guns/shotgun_right.png'
        this.sniper.left.src = './assets/guns/sniper_left.png'
        this.sniper.right.src = './assets/guns/sniper_right.png'
        this.smg.left.src = './assets/guns/smg_left.png'
        this.smg.right.src = './assets/guns/smg_right.png'
        this.pistol.left.src = './assets/guns/pistol_left.png'
        this.pistol.right.src = './assets/guns/pistol_right.png'
        this.miniGun.left.src = './assets/guns/minigun_left.png'
        this.miniGun.right.src = './assets/guns/minigun_right.png'
        this.grenadeLauncher.left.src = './assets/guns/grenade_launcher_left.png'
        this.grenadeLauncher.right.src = './assets/guns/grenade_launcher_right.png'
    }
}
sprites.set()