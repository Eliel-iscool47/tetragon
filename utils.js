const utils = {
    randomFloat(min, max) {
        return Math.random() * (max - min + 1) + min
    },
    randomInt(min, max) {
        return Math.floor(this.randomFloat(min, max))
    },
    flround(num, percision) {
        if (this.isNullish(percision)) percision = 0
        return Math.floor(num * (10 ** percision) + 0.5) / (10 ** percision)
    },
    slope(ln1, lat1, ln2, lat2) {
        return Math.atan2(lat2 - lat1, ln2 - ln1)
    },
    distance(ln1, lat1, ln2, lat2) {
        return Math.sqrt((ln2 - ln1) ** 2 + (lat2 - lat1) ** 2)
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
    isNullish(val){
        return val == null || val == undefined || val == '' || val == {} || val == []
    },
    redirect(url) {
        window.location.replace(url)
    }
}