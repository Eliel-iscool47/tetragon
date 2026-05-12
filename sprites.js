const default_sprites = {
	commanderHat: {
		left: new Image(),
		right: new Image(),
	},
	/**
	 * Programmatically removes a specific background color from an image.
	 * Defaults to removing pure white (255, 255, 255).
	 */
	processTransparency(img, r = 255, g = 255, b = 255) {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		canvas.width = img.width
		canvas.height = img.height
		ctx.drawImage(img, 0, 0)
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const data = imageData.data
		for (let i = 0; i < data.length; i += 4) {
			// If pixel matches the target background color, set alpha to 0 (transparent)
			if (data[i] === r && data[i + 1] === g && data[i + 2] === b) {
				data[i + 3] = 0
			}
		}
		ctx.putImageData(imageData, 0, 0)
		return canvas
	},
	init() {
		const loadAndProcess = (side, src) => {
			const img = new Image()
			img.onload = () => {
				// Replace the Image object with the processed transparent Canvas
				this.commanderHat[side] = this.processTransparency(img)
			}
			img.src = src
		}
		loadAndProcess('right', './assets/commander_hat_right.png')
		loadAndProcess('left', './assets/commander_hat_left.png')
	}
}

const sprites = {...default_sprites}

sprites.init()