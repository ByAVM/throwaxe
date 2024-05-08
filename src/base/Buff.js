// Buff effect description
function getId() {
    return Math.ceil(Math.random() * 10037)
}

function Buff(x, y) {
    this.id = getId()
    this.title = 'Base buff'

    this.x = x
    this.y = y

    this.width = 64
    this.height = 64

    this.nX = this.x + 64
    this.nY = this.y + 64

    this.texture = 'buff'
}

// Applies function to player
Buff.prototype.useEffect = function(player) {
    console.log(`Player ${player.name} use ${this.title} buff (${this.id})`)
}

Buff.prototype.checkCollision = function(x, y) {
    return x >= this.x && x < this.nX && y >= this.y && y < this.nY
}

Buff.prototype.get = function() {
    return {
        id: this.id,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        texture: this.texture
    }
}

module.exports = Buff