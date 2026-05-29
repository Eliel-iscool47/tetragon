var collisions = {
	center: {
		x: 0, // Initialized to 0, will be set correctly in reset()
		y: 0, // Initialized to 0, will be set correctly in reset()
	},
	border: {
		left: 25,
		right: 0, // Initialized to 0, will be set correctly in reset()
		top: 25,
		bottom: 0, // Initialized to 0, will be set correctly in reset()
	},
	get defaults() {
		return {
			center: {
				x: (state.simulation?.world?.width || 1500) / 2,
				y: (state.simulation?.world?.height || 800) / 2,
			},
			border: {
				left: 25,
				right: (state.simulation?.world?.width || 1500) - (state.player?.size || 50) / 2,
				top: 25,
				bottom: (state.simulation?.world?.height || 800) - (state.player?.size || 50) / 2,
			}
		}
	},

	set defaults(val) { throw new Error('collisions.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	grid: {
		size: 100,
		cells: [],
		cols: 0,
		rows: 0,
		init() {
			this.cols = Math.ceil((state.simulation?.world?.width || 1500) / this.size) + 1
			this.rows = Math.ceil((state.simulation?.world?.height || 800) / this.size) + 1
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
					const cell = this.cells[nx + ny * this.cols];
					if (cell) {
						for (let k = 0, kLen = cell.length; k < kLen; k++) {
							callback(cell[k]);
						}
					}
				}
			}
		}
	},
	loop(timeScale = 1) {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		const ts = timeScale ?? simulation.timeScale
		state.player.pos.x = clamp(state.player.pos.x, collisions.border.left, collisions.border.right)
		state.player.pos.y = clamp(state.player.pos.y, collisions.border.top, collisions.border.bottom)

		this.grid.clear()
		bullets.list.forEach((b) => this.grid.add(b))
		// Add mobs to the grid for separation force and proximity checks
		mobs.list.forEach((m) => { m.isMob = true; this.grid.add(m); })

		const explosionsToUpdate = new Set();

		for (let i = 0; i < bullets.explosionList.length; i++) {
			bullets.explosionList[i].isExplosion = true
			this.grid.add(bullets.explosionList[i])
		}
		
		const fireList = state.bullets.firePoolList ?? []
		fireList.forEach((f) => {
			f.isFirePool = true
			this.grid.add(f)
		})

		mobs.list = mobs.list.filter((mob) => {
			const world = state.simulation.world || { width: 1500, height: 800 }
			// Check for death or out-of-bounds projectiles
			const isOutOfBounds = mob.pos.x < -200 || mob.pos.x > world.width + 200 || mob.pos.y < -200 || mob.pos.y > world.height + 200
			if (mob.health <= 0 || (isOutOfBounds && mob.class == 'projectile')) {
				if (mob.health <= 0) mob.die()
				return false
			}

			mob.health = Math.min(mob.health, mob.maxHealth)

			// Player collision
			if (state.player.checkCollision(mob)) if (!mob.onCollide()) return false

			// Bullet/Explosion collision via grid
			this.grid.query(mob.pos.x, mob.pos.y, (e) => {
				// Fix: Projectiles (boss bullets/lasers) should not be destroyed by player fire
				if (mob.class === 'projectile') return 

				if (e.isExplosion) {
					if (!e.targetsPlayerOnly && 
						e.timeSinceLastAttack <= 
						simulation.time - 0.05 &&
						mob.checkCollision(e)
					) {
						mob.takeDamage(e.damage * state.player.damageDone)
						explosionsToUpdate.add(e)
					}
				} else if (e.isFirePool) {
					const dx = mob.pos.x - e.pos.x;
					const dy = mob.pos.y - e.pos.y;
					const distSq = dx * dx + dy * dy;
					const range = e.size + mob.size / 2;
					if (distSq <= range * range) {
						// Scale damage by delta time so DoT is frame-independent
						mob.takeDamage(e.damage * state.player.damageDone * ts)
					}
				} else { // Bullet
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
			return true
		})

		// Update explosion timers only after all mobs have been checked for this frame
		// This ensures all mobs in the radius take damage before the cooldown starts
		explosionsToUpdate.forEach(e => e.timeSinceLastAttack = simulation.time)

		bullets.explosionList.forEach((xp) => {
			if (distance(state.player.pos.x, state.player.pos.y, xp.pos.x, xp.pos.y) <= xp.size / 2 + state.player.size / 2 && xp.timeSinceLastAttack < simulation.time - 0.05) {
				state.player.takeDamage(xp.damage * ts, xp)
				xp.timeSinceLastAttack = simulation.time
				upgrades.lastHealthRegen = simulation.time
			}
		})
	},
}