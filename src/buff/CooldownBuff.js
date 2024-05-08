const Buff = require("../base/Buff")

function CooldownBuff(x, y) {
    Buff.call(this, x, y)

    this.title = 'Cooldown'
    this.texture = 'cooldown-buff'

    this.cooldownRatio = 1.25
    this.timeout = 15000
}

Object.assign(CooldownBuff.prototype, Buff.prototype)

CooldownBuff.prototype.constructor = CooldownBuff

CooldownBuff.prototype.useEffect = function(player) {
    const cooldown = player.weapon.cooldown

    player.weapon.cooldown = cooldown / this.cooldownRatio

    setTimeout(() => {
        player.weapon.cooldown = cooldown * this.cooldownRatio
    }, this.timeout)
}

module.exports = CooldownBuff