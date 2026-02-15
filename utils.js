const utils = {
    randomFloat(min, max) {
        return Math.random() * (max - min + 1) + min
    },
    randomInt(min, max) {
        return Math.floor(this.randomFloat(min, max))
    },
    floatRound(num, precision) {
        if (this.isNullish(precision)) precision = 0
        return Math.floor(num * (10 ** precision) + 0.5) / (10 ** precision)
    },
    angle(x1, y1, x2, y2) {
        return Math.atan2(y1 - y2, x1 - x2)
    },
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    },
    polarCoords(r, theta) {
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        }
    },
    now() {
        return Date.now() / 1000
    },
    isNullish(val) {
        return val == null || val == undefined || val == '' || val == {} || val == []
    },
    redirect(url) {
        window.location.src = url
    },
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max)
    },
    lerp(a, b, t) {
        return a + (b - a) * this.clamp(t, 0, 1)
    },
    avg(args) {
        let sum = 0
        args.forEach(arg => {
            sum += arg
        })
        return sum / args.length
    }
}