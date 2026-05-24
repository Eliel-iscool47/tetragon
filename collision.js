var collisions = {
	center: {
		x: main.width / 2,
		y: main.height / 2,
	},
	border: {
		left: 25,
		right: main.width - 25, // Set safe defaults initially
		top: 25,
		bottom: main.height - 25,
	},
	get defaults() {
		return {
			center: {
				x: main.width / 2,
				y: main.height / 2,
			},
			border: {
				left: 25,
				right: main.width - state.player.size / 2,
				top: 25,
				bottom: main.height - state.player.size / 2,
			}
		}
	},

	set defaults(val) { throw new Error('collisions.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	grid: {
		size: 150,
		cells: [],
		cols: 0,
		rows: 0,
		init() {
			this.cols = Math.ceil(main.width / this.size) + 1
			this.rows = Math.ceil(main.height / this.size) + 1
			this.cells = Array.from({ length: this.cols * this.rows }, () => [])
		},
		clear() {
			for (let i = 0, len = this.cells.length; i < len; i++) {
				this.cells[i].length = 0
			}
		},
		add(obj) {
			const cx = Math.floor(obj.pos.x / this.size)
			const cy = Math.floor(obj.pos.y / this.size)
			if (cx >= 0 && cx < this.cols && cy >= 0 && cy < this.rows) {
				this.cells[cx + cy * this.cols].push(obj)
			}
		},
		query(x, y, callback) {
			const cx = Math.floor(x / this.size)
			const cy = Math.floor(y / this.size)
			for (let i = -1; i <= 1; i++) {
				const nx = cx + i
				if (nx < 0 || nx >= this.cols) continue
				for (let j = -1; j <= 1; j++) {
					const ny = cy + j
					if (ny < 0 || ny >= this.rows) continue
					const cell = this.cells[nx + ny * this.cols]
					for (let k = 0, kLen = cell.length; k < kLen; k++) {
						callback(cell[k])
					}
				}
			}
		}
	},
	loop() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		state.player.pos.x = clamp(state.player.pos.x, collisions.border.left, collisions.border.right)
		state.player.pos.y = clamp(state.player.pos.y, collisions.border.top, collisions.border.bottom)

		this.grid.clear()
		for (let i = 0; i < bullets.list.length; i++) {
			this.grid.add(bullets.list[i])
		}
		for (let i = 0; i < bullets.explosionList.length; i++) {
			bullets.explosionList[i].isExplosion = true
			this.grid.add(bullets.explosionList[i])
		}

		mobs.list = mobs.list.filter(function (mob) {
			// Check for death or out-of-bounds projectiles
			if (mob.health <= 0 || (!inCanvas(mob.pos.x, mob.pos.y, main) && mob.class == 'projectile')) {
				if (mob.health <= 0) mob.die()
				return false
			}

			mob.health = Math.min(mob.health, mob.maxHealth)

			// Player collision
			if (state.player.checkCollision(mob)) if (!mob.onCollide()) return false

			// Bullet/Explosion collision via grid
			this.grid.query(mob.pos.x, mob.pos.y, (e) => {
				if (e.isExplosion) {
					if (!e.targetsPlayerOnly && 
						e.timeSinceLastAttack <= 
						simulation.time - 0.05 &&
						mob.checkCollision(e)
					) {
						mob.takeDamage(e.damage * state.player.damageDone)
						e.timeSinceLastAttack = simulation.time
					}
				} else {
					if (e.piercing > 0 && mob.checkCollision(e)) {
						mob.takeDamage(e.damage * state.player.damageDone)
						if (e.type == 'bouncyBalls') {
							// Realistic reflection off circle normal
							const dist = distance(e.pos.x, e.pos.y, mob.pos.x, mob.pos.y)
							const nx = (e.pos.x - mob.pos.x) / dist
							const ny = (e.pos.y - mob.pos.y) / dist
							const vx = Math.cos(e.angle)
							const vy = Math.sin(e.angle)
							const dot = vx * nx + vy * ny
							e.angle = Math.atan2(vy - 2 * dot * ny, vx - 2 * dot * nx) + rand(-0.05, 0.05)
							if (upgrades.isBulletExplode) {
								bullets.explosion(e.pos.x, e.pos.y, 1)
								e.piercing = 0
							}
							e.speed = Math.min(30, e.speed + 0.15)
						}
						e.piercing--
					}
				}
			})
			const fireList = state.bullets.firePoolList ?? []
			fireList.forEach(function (f) {
				if (distance(mob.pos.x, mob.pos.y, f.pos.x, f.pos.y) <= f.size + mob.size / 2) {
					mob.takeDamage(f.damage * state.player.damageDone)
				}
			})
			return true
		}.bind(this))
		bullets.explosionList.forEach(function (xp) {
			if (distance(state.player.pos.x, state.player.pos.y, xp.pos.x, xp.pos.y) <= xp.size / 2 + state.player.size / 2 && xp.timeSinceLastAttack < simulation.time - 0.05) {
				state.player.takeDamage(xp.damage)
				xp.timeSinceLastAttack = simulation.time
				upgrades.lastHealthRegen = simulation.time
			}
		}.bind(this))
	},
}