function Controls() {
    this.left = false
    this.right = false
    this.top = false
    this.down = false
    this.space = false
}

Controls.prototype.update = function(controls) {
    this.left = controls.left
    this.right = controls.right
    this.top = controls.top
    this.down = controls.down
    this.space = controls.space
}

Controls.prototype.get = function() {
    return {
        left: this.left,
        right: this.right,
        top: this.top,
        down: this.down,
        space: this.space
    }
}

Controls.prototype.set = function(type, state) {
    this[type] = state
}

module.exports = Controls