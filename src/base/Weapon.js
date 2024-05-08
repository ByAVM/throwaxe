const Bullet = require('./Bullet')

const PI_2 = Math.PI / 2

function Weapon(scene, player, texture = 'TAxe') {
    this.ready = true
    this.cooldown = 1500
    this.speed = 9
    this.distance = 35
    this.texture = texture
    this.damage = 12

    this.player = player

    this.scene = scene
}

Weapon.prototype.throwDirectly = function(startPos, rotation) {
    if (this.ready) {
        const { x, y } = startPos
        this.ready = false

        const weapon = this.createBullet(
            x + this.distance * Math.cos(rotation + PI_2),
            y + this.distance * Math.sin(rotation + PI_2),
            rotation
        )

        setTimeout(() => this.ready = true, this.cooldown)

        return weapon
    }
}

Weapon.prototype.createBullet = function(x, y, rotation) {
    return new Bullet(this.player, this, x, y, rotation)
}

Weapon.prototype.getReady = function() {
    return this.ready
}

module.exports = Weapon