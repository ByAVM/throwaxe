function Position(x = 0, y = 0) {
    this.x = x
    this.y = y
}

Position.prototype.update = function(x, y) {
    this.x = x
    this.y = y
}

Position.prototype.get = function() {
    return { x: this.x, y: this.y }
}

module.exports = Position