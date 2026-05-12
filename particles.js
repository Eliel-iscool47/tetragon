var particles = {
	Particle: class {
		constructor(state, x, y, config) {
			Object.assign(this, config)
			this.state = state
			this.pos = { x, y }
			this.color = config.color
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
	get defaults() {
		return { list: [] }
	},

	set defaults(val) { throw new Error('particles.defaults is read-only') },

	reset() {
		Object.assign(this, this.defaults)
	},
	spawn(x, y, config) {
		this.list.push(new this.Particle(state, x, y, config))
	},
	draw() {
		this.list.forEach(function (p) { return p.draw() }.bind(this))
	},
	update() {
		this.list.forEach(function (p) { return p.update() }.bind(this))
	},
	vampire: {
		size: 5,
		color: 'hsl(0, 100%, 25%)',
		speed: 0,
		duration: 0.6,
		angle: 0,
		draw() {
			draw.beginPath()
			draw.fillStyle = this.color
			draw.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
			draw.fill()
		},
		update() {
			this.angle = angle(this.state.player.pos.x, this.state.player.pos.y, this.pos.x, this.pos.y)
			this.pos.x += Math.cos(this.angle) * this.speed
			this.pos.y += Math.sin(this.angle) * this.speed
			if (this.state.simulation.time > this.time + this.duration) this.state.particles.list = this.state.particles.list.filter(p => p != this)
		}
	},
}