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
	grid: {
		size: 150,
		cells: new Map(),
		clear() {
			this.cells.clear()
		},
		add(obj) {
			const key = Math.floor(obj.pos.x / this.size) + ',' + Math.floor(obj.pos.y / this.size)
			if (!this.cells.has(key)) this.cells.set(key, [])
			this.cells.get(key).push(obj)
		},
		query(x, y, callback) {
			const cx = Math.floor(x / this.size)
			const cy = Math.floor(y / this.size)
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					const key = (cx + i) + ',' + (cy + j)
					const cell = this.cells.get(key)
					if (cell) {
						for (let k = 0; k < cell.length; k++) {
							callback(cell[k])
						}
					}
				}
			}
		}
	},
	loop() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		player.pos.x = clamp(player.pos.x, collisions.border.left, collisions.border.right)
		player.pos.y = clamp(player.pos.y, collisions.border.top, collisions.border.bottom)

		this.grid.clear()
		for (let i = 0; i < bullets.list.length; i++) {
			this.grid.add(bullets.list[i])
		}
		for (let i = 0; i < bullets.explosionList.length; i++) {
			bullets.explosionList[i].isExplosion = true
			this.grid.add(bullets.explosionList[i])
		}

		mobs.list.forEach(mob => {
			if (mob.health <= 0 || (!inCanvas(mob.pos.x, mob.pos.y, main) && mob.class == 'projectile' && mob.type != 'hexagon minion')) {
				mobs.list.splice(mobs.list.indexOf(mob), 1)
				if (upgrades.isKillDefense) upgrades.lastKill = simulation.time
				if (percentChance(upgrades.powerUpSpawnChance * 0.15 * mob.dropChance) && mob.class != 'projectile') powerUps.ammo.new(mob.pos.x, mob.pos.y)
				if (percentChance(upgrades.powerUpSpawnChance * 0.1 * mob.dropChance) && mob.class != 'projectile') powerUps.heal.new(mob.pos.x, mob.pos.y)
				if (percentChance(upgrades.powerUpSpawnChance * 0.1 * mob.dropChance) && mob.class != 'projectile') powerUps.reroll.new(mob.pos.x, mob.pos.y)
				if (percentChance(upgrades.powerUpSpawnChance * 0.03 * mob.dropChance) && mob.class != 'projectile') powerUps.gun.new(mob.pos.x, mob.pos.y)
				if ((percentChance(upgrades.powerUpSpawnChance * 0.01 * mob.dropChance) || mob.class == 'boss') && mob.class != 'projectile') powerUps.upgrade.new(mob.pos.x, mob.pos.y)
			}
			mob.health = Math.min(mob.health, mob.maxHealth)
			if (distance(mob.pos.x, mob.pos.y, player.pos.x, player.pos.y) <= Math.max(player.size, mob.size) / 2) {
				if (!player.isInvulnerable) {
					player.health -= mob.damage * player.damageTaken
					player.lastDamageTime = simulation.time
				}
				upgrades.lastHealthRegen = simulation.time
				mob.timeSinceLastAttack = simulation.time
				if (mob.class != 'projectile') {
					mob.pos.x += Math.cos(input.cursor.angle) * mob.speed * mob.size
					mob.pos.y += Math.sin(input.cursor.angle) * mob.speed * mob.size
					mob.onCollide()
				} else mobs.list = mobs.list.filter(m => m != mob)
			}
			this.grid.query(mob.pos.x, mob.pos.y, (e) => {
				if (e.isExplosion) {
					if (distance(mob.pos.x, mob.pos.y, e.pos.x, e.pos.y) <= mob.size * 0.5 && e.timeSinceLastAttack <= simulation.time - 0.05) {
						mob.health -= bullets.explosions.damageDone * player.damageDone
						e.timeSinceLastAttack = simulation.time
					}
				} else {
					if (e.piercing > 0 && distance(mob.pos.x, mob.pos.y, e.pos.x, e.pos.y) <= mob.size / 2) {
						mob.health -= e.damage * player.damageDone
						if (e.type == 'bouncyBalls') {
							e.angle += rand(Math.PI * -0.05, Math.PI * 0.05)
							if (upgrades.isBulletExplode) {
								bullets.explosion(e.pos.x, e.pos.y, 2)
								e.piercing = 0
							}
						}
						e.piercing--
					}
				}
			})
		})
		bullets.explosionList.forEach(xp => {
			if (distance(player.pos.x, player.pos.y, xp.pos.x, xp.pos.y) <= xp.size / 2 + player.size / 2 && xp.timeSinceLastAttack < simulation.time - 0.05) {
				player.health -= bullets.explosions.damageDone * player.damageTaken
				player.lastDamageTime = simulation.time
				xp.timeSinceLastAttack = simulation.time
				upgrades.lastHealthRegen = simulation.time
			}
		})
	},
}