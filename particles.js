var particles = {
	Particle: class {
		constructor(state) {
			this.state = state
			this.active = false
		}

		init(x, y, config) {
			// Reset to base defaults to avoid property leakage from previous pooled usage
			this.size = 10
			this.color = 'black'
			this.speed = 0
			this.angle = 0
			this.vx = 0
			this.vy = 0
			this.draw = particles.Particle.prototype.draw
			this.update = particles.Particle.prototype.update
			
			Object.assign(this, config)
			this.pos = { x, y }
			this.timeSpawned = this.state.simulation.time
			this.active = true
		}

		draw() {
			draw.beginPath()
			draw.fillStyle = this.color
			draw.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
			draw.fill()
		}

		update() {
			this.pos.x += Math.cos(this.angle) * this.speed
			this.pos.y += Math.sin(this.angle) * this.speed
		}
	},
	list: [],
	pool: [],
	get defaults() {
		return { list: [], pool: [] }
	},

	set defaults(val) { throw new Error('particles.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	spawn(x, y, config) {
		let p
		if (this.pool.length > 0) {
			p = this.pool.pop()
		} else {
			p = new this.Particle(state)
		}
		p.init(x, y, config)
		this.list.push(p)
	},
	draw() {
		this.list.forEach(function (p) { return p.draw() }.bind(this))
	},
	update() {
		if (simulation.isPaused || simulation.isChoosing) return undefined
		for (let i = this.list.length - 1; i >= 0; i--) {
			const p = this.list[i]
			p.update()
			
			if (!p.active) {
				this.pool.push(p)
				this.list.splice(i, 1)
			}
		}
	},
	vampire: {
		size: 6,
		color: 'hsl(0, 100%, 45%)',
		speed: 10,
		duration: 1.5,
		healAmount: 0, // Default heal amount
		angle: 0,
		update() {
			this.angle = angle(this.state.player.pos.x, this.state.player.pos.y, this.pos.x, this.pos.y)
			this.speed = Math.min(25, this.speed + 0.3) // Accelerate towards the player
			this.pos.x += Math.cos(this.angle) * this.speed
			this.pos.y += Math.sin(this.angle) * this.speed

			const dist = distance(this.pos.x, this.pos.y, this.state.player.pos.x, this.state.player.pos.y)
			if (dist < this.state.player.size / 2) {
				this.state.player.heal(this.healAmount) // Only heal on actual contact
				this.active = false
			} else if (this.state.simulation.time - this.timeSpawned > this.duration) {
				this.active = false
				this.state.player.heal(this.healAmount)
			}
		}
	},
	missileSmoke: {
		size: 4,
		color: 'hsl(220, 10%, 50%)', // Greyish blue
		speed: 0.5,
		duration: 0.4, // Short duration
		draw() {
			const elapsed = this.state.simulation.time - this.timeSpawned;
			const alpha = clamp(1 - (elapsed / this.duration), 0, 1); // Fade out
			draw.save();
			draw.globalAlpha = alpha;
			draw.beginPath();
			draw.fillStyle = this.color;
			draw.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
			draw.fill();
			draw.restore();
		},
		update() {
			this.pos.x += Math.cos(this.angle) * this.speed;
			this.pos.y += Math.sin(this.angle) * this.speed;
			if (this.state.simulation.time - this.timeSpawned > this.duration) {
				this.active = false
			}
		}
	},
	textPopup: {
		size: 24,
		color: 'white',
		duration: 0.8,
		vx: 0,
		vy: 0,
		gravity: 0.2,
		update() {
			this.vy += this.gravity;
			this.pos.x += this.vx;
			this.pos.y += this.vy;

			if (this.state.simulation.time - this.timeSpawned > this.duration) {
				this.active = false
			}
		},
		draw() {
			const elapsed = this.state.simulation.time - this.timeSpawned;
			const alpha = clamp(1 - (elapsed / this.duration), 0, 1);
			draw.save();
			draw.globalAlpha = alpha;
			draw.fillStyle = this.color;
			draw.strokeStyle = 'black';
			draw.lineWidth = 1;
			draw.font = `bold ${this.size}px "DM Sans"`;
			draw.textAlign = 'center';
			draw.fillText(this.text, this.pos.x, this.pos.y);
			draw.strokeText(this.text, this.pos.x, this.pos.y);
			draw.restore();
		}
	},
	bouncyBallTrail: {
		size: 8,
		color: 'hsl(35, 100%, 50%)',
		duration: 0.3,
		draw() {
			const elapsed = this.state.simulation.time - this.timeSpawned;
			const alpha = clamp(1 - (elapsed / this.duration), 0, 1);
			draw.save();
			draw.globalAlpha = alpha * 0.5; // Slight transparency
			draw.beginPath();
			draw.fillStyle = this.color;
			// Shrink the trail particle over its lifetime
			draw.arc(this.pos.x, this.pos.y, this.size * alpha, 0, Math.PI * 2);
			draw.fill();
			draw.restore();
		},
		update() {
			if (this.state.simulation.time - this.timeSpawned > this.duration) {
				this.active = false
			}
		}
	},
	hexagonTrail: {
		size: 8,
		color: 'hsl(30, 100%, 50%)',
		duration: 0.4,
		draw() {
			const elapsed = this.state.simulation.time - this.timeSpawned;
			const alpha = clamp(1 - (elapsed / this.duration), 0, 1);
			draw.save();
			draw.globalAlpha = alpha * 0.4;
			draw.beginPath();
			polygon(this.pos.x, this.pos.y, this.size * alpha, 6, this.angle);
			draw.fillStyle = this.color;
			draw.fill();
			draw.restore();
		},
		update() {
			if (this.state.simulation.time - this.timeSpawned > this.duration) {
				this.active = false
			}
		}
	},
}