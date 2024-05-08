const Buff = require("../base/Buff")

function SpeedBuff(x, y) {
    Buff.call(this, x, y)

    this.title = 'Speed'
    this.texture = 'speed-buff'

    this.speedRatio = 1.3
    this.timeout = 15000
}

Object.assign(SpeedBuff.prototype, Buff.prototype)

SpeedBuff.prototype.constructor = SpeedBuff

SpeedBuff.prototype.useEffect = function(player) {
    const speed = player.speed
    
    player.speed = speed * this.speedRatio
    
    setTimeout(() => {
        player.speed = speed / this.speedRatio
    }, this.timeout)
}

module.exports = SpeedBuff