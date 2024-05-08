const SPRITE_WIDTH = 64
const SPRITE_HEIGHT = 64

function Environment(scene, x, y, widthCells, heightCells, texture) {
    this.scene = scene
    this.x = x
    this.y = y

    this.width = widthCells * SPRITE_WIDTH
    this.height = heightCells * SPRITE_HEIGHT

    this.nX = x + this.width
    this.nY = y + this.height

    this.texture = texture
}


Environment.prototype.get = function() {
    return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        texture: this.texture
    }
}

Environment.prototype.checkCollision = function(x, y, width = 0, height = 0) {
    if (width || height) {
        return x > this.x && 
            x < this.nX && 
            y > this.y && 
            y < this.nY ||
            x + width > this.x &&
            x + width < this.nX &&
            y + height > this.y &&
            y + height < this.nY
    }
    return x > this.x && x < this.nX && y > this.y && y < this.nY
}

module.exports = Environment