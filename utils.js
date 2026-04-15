/**
 * A collection of utilities, made for game development. Change 'drawCTX' to be the canvas's draw context
 */

/**
 * The context for the drawing methods. Change it if your canvas rendering context has a different name.
 */
let drawCTX = draw
/**
 * Short-form for undefined.
 */
const n = undefined
/**
 * Multiply an angle in degrees by this to convert it to radians.
 */
const degree = Math.PI / 180
/**
 * Returns a pseudorandom number within the bounds selected
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 */
function rand(min, max) {
	min ??= 0
	max ??= min + 1
	return lerp(min, max, Math.random())
}
function randInt(min, max) {
	min ||= 0
	max ??= min + 100
	return Math.round(rand(min, max))
}
/**
 * Returns the angle between the x-axis and the line passing between the two specified points
 * @param {number} x1 the first point's x-position
 * @param {number} y1 the first point's y-position
 * @param {number} x2 the second point's x-position
 * @param {number} y2 the second point's y-position
 */
function angle(x1, y1, x2, y2) {
	return Math.atan2(y1 - y2, x1 - x2)
}
/**
 * Returns the Euclidean distance between the two specified points.
 * @param {number} x1 the first point's x-position
 * @param {number} y1 the first point's y-position
 * @param {number} x2 the second point's x-position
 * @param {number} y2 the second point's y-position
 */
function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}
/**
 * Returns the number of seconds elapsed since midnight, 1st January, 1970, UTC
 */
function now() {
	return Date.now() / 1000
}
/**
 * Checks if the value is null or undefined.
 * @param {*} val the value to check.
 */
function isNullish(val) {
	return val == null ||
		val == undefined
}
/**
 * redirects the window to the specific URL.
 * @param {*} url the URL to redirect to
 */
function redirect(url) {
	window.location.href = url
}
/**
 * @param {number} num the value to clamp
 * @param {number} min the minimum
 * @param {number} max the maximum
 * @returns the number, clamped to be in the range (min to max)
 */
function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max)
}
/**
 * Performs a linear interpolation between two values.
 * @param {number} start the starting value
 * @param {number} end the ending value
 * @param {number} time a number between 0 and 1
 * @returns 
 */
function lerp(start, end, time) {
	return start + (end - start) * clamp(time, 0, 1)
}
/**
 * Returns the
 * @param {*} args 
 */
function avg(args) {
	let sum = 0
	args.forEach(function (a) {
		sum += a
	}.bind(this))
	return sum / args.length
}
function root(value, root) {
	return value ** (1 / root)
}
/**
 * Calls the callback function n times
 * @param {function} callback the function to repeat
 * @param {number} n the number of times to repeat. Will be rounded to the nearest integer.
 */
function repeat(callback, n) {
	n ??= 1
	n = Math.round(n)
	if (n <= 0 || typeof callback != "function") return undefined
	while (n--) {
		callback()
	}
}
/**
 * Returns the sign (positive = 1; negative = -1; zero = 0) of a number. Non-numbers are treated as 0.
 * @param {number} value 
 */
function sign(value) {
	value ||= 0
	return value < 0 ? -1 : value > 0 ? 1 : 0
}
/**
 * Returns true if the percent is greater than a pseudo-randomly selected number between 0 and 1, and false otherwise.
 * @param {number} chance the percent chance, represented as a part of a whole (100% = 1; 50% = 0.5; ect.)
 */
function percentChance(chance) {
	chance ??= 1
	return chance >= Math.random()
}
/**
 * Chooses random elements from an array and returns them as an array
 * @param {array} array 
 * @param {number} amount 
 * @returns the chosen elements as an array
 */
function chooseRandom(array, amount) {
	amount ??= 1
	amount = Math.min(amount, array.length)
	let chosen = []
	repeat(() => {
		if (array.length == 0) return undefined
		const r = randInt(0, array.length - 1)
		chosen.push(array.at(r))
		array = array.filter((_, i) => i !== r)
	}, amount)
	return chosen
}
/**
 * Counts the occurrences of a given value in an array.
 * @param {array} array the array to search
 * @param {*} value the value to count
 * @returns 
 */
function countOccurrences(array, value) {
	let c = 0
	array.forEach(e => {
		if (e == value) {
			c++
		}
	})
	return c
}
/**
 * This method draws a regular polygon on the canvas.
 * @param {number} x the cartesian x-position of the shape.
 * @param {number} y the cartesian y-position of the shape.
 * @param {number} radius the distance between one of the points and the center of the shape.
 * @param {number} points the number of points the shape has.
 * @param {number} rotation the angle, in radians, the shape should be rotated. This is optional.
 */
function polygon(x, y, radius, points, rotation) {
	x ??= 0
	y ??= 0
	radius ??= 10
	points ??= 6
	points = Math.round(points)
	rotation ??= Math.PI / points
	drawCTX.moveTo(x + (radius * Math.cos(rotation)), y + (radius * Math.sin(rotation)))
	repeat(function () {
		drawCTX.lineTo(x + (radius * Math.cos(rotation + (Math.PI * 2) / points)), y + (radius * Math.sin(rotation + (Math.PI * 2) / points)))
		rotation += (Math.PI * 2) / points
	}, points)
}
/**
 * 
 * @param {number} x the x-position of the point
 * @param {number} y the y-position of the point
 * @param {HTMLCanvasElement} canvas the canvas to check if the point is in it
 * @returns 
 */
function inCanvas(x, y, canvas) {
	x ??= 0
	y ??= 0
	canvas ??= {
		width: 0,
		height: 0
	}
	return x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height
}
function pointInRect(px, py, rx, ry, rw, rh) {
	px ??= 0
	py ??= 0
	rx ??= 0
	ry ??= 0
	rw ??= 10
	rh ??= 10
	return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
}
function pointInCircle(px, py, cx, cy, r) {
	px ??= 0
	py ??= 0
	cx ??= 0
	cy ??= 0
	r ??= 10
	return distance(px, py, cx, cy) <= r
}
/**
 * Draws an isosceles triangle.
 */
function isoscelesTriangle(x, y, base, height, rotation) {
	drawCTX.beginPath()
	drawCTX.moveTo(x - (base / 2) + Math.cos(rotation) * (base / 2), y + (height / 2) + Math.sin(rotation) * (base / 2))
	drawCTX.lineTo(x + Math.cos(rotation) * (base / 2), y - (height / 2) + Math.sin(rotation) * (base / 2))
	drawCTX.lineTo(x + (base / 2) + Math.cos(rotation) * (base / 2), y + (height / 2) + Math.sin(rotation) * (base / 2))
	drawCTX.closePath()
	drawCTX.fill()
}
/**
 * 
 * @param {number} angle1 
 * @param {number} angle2 
 * @returns 
 */
function diffAngle(angle1, angle2) {
	angle1 ??= 0
	angle2 ??= 0
	return Math.abs(angle1 - angle2) % (Math.PI * 2)
}
function lineCircleCollision(x1, y1, x2, y2, cx, cy, r) {
	x1 ??= 0
	y1 ??= 0
	x2 ??= 0
	y2 ??= 0
	cx ??= 0
	cy ??= 0
	r ??= 0

	const dx = x2 - x1
	const dy = y2 - y1
	const lengthSq = dx * dx + dy * dy
	if (lengthSq == 0) return distance(x1, y1, cx, cy) <= r

	// Project the circle center onto the line segment to find the closest point
	let t = ((cx - x1) * dx + (cy - y1) * dy) / lengthSq
	t = Math.max(0, Math.min(1, t)) // Clamp t to the segment bounds [0, 1]

	const closestX = x1 + t * dx
	const closestY = y1 + t * dy
	return distance(cx, cy, closestX, closestY) <= r
}