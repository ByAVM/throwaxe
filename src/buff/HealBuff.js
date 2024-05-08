const Buff = require("../base/Buff")

function HealBuff(x, y) {
    Buff.call(this, x, y)

    this.title = 'Heal'
    this.texture = 'heal-buff'

    this.healValue = 25
}

Object.assign(HealBuff.prototype, Buff.prototype)

HealBuff.prototype.constructor = HealBuff

HealBuff.prototype.useEffect = function(player) {
    const { max, current } = player.hp
    
    if (max == current) return

    const value = (max - current) < this.healValue ? max - current : this.healValue
    player.hp.heal(value)
}

module.exports = HealBuff