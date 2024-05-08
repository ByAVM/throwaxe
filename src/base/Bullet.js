function getId() {
    return Math.ceil(Math.random() * 10037)
}

const LIFETIME = 3000

function Bullet(player, weapon, x, y, rotation) {
    this.x = x
    this.y = y
    this.rotation = rotation
    this.texture = weapon.texture
    this.speed = weapon.speed
    this.lifetime = LIFETIME

    this.damage = weapon.damage

    this.player = player

    this.id = getId()

    this._isDead = false

    this._isMoving = true
    
    setTimeout(() => {
        this._isDead = true
    }, LIFETIME)
}

Bullet.prototype.update = function(envs) {
    if (this._isMoving === false) return

    this.x += this.speed * Math.cos(this.rotation)
    this.y += this.speed * Math.sin(this.rotation)

    envs.forEach(env => {
        if (env.checkCollision(this.x, this.y)) {
            this._isMoving = false
        }
    })
}

Bullet.prototype.isDead = function() {
    return this._isDead
}

Bullet.prototype.isActive = function() {
    return this._isMoving
}
Bullet.prototype.getState = function() {
    return {
        x: this.x,
        y: this.y,
        isActive: this.isActive(),
        rotation: this.rotation,
        texture: this.texture,
        id: this.id
    }
}

module.exports = Bullet