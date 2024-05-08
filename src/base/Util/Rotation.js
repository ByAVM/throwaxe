const PI2 = Math.PI * 2
const T = 0.35

function shortAngleDist(start, end) {
    const max = PI2
    const da = (end - start) % max
    return 2 * da % max - da
}


function Rotation(value = 0) {
    this.value = value
    this.targetValue = this.value
}

Rotation.prototype.get = function() {
    return this.value
}

Rotation.prototype.update = function(value, useLerp = false) {
    this.targetValue = value
    
    if (useLerp) this._lerp()
}

Rotation.prototype._lerp = function() {
    this.value = this.value + shortAngleDist(this.value, this.targetValue) * T
}

module.exports = Rotation