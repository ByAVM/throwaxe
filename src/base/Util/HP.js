function HP(max, current = null) {
    this.max = max
    this.current = current || max
}

HP.prototype.heal = function(value, overheal = false) {
    if (overheal) {
        this.max = value
        this.current = value
        return
    }
    this.current += value
}

HP.prototype.hit = function(dmg) {
    if (this.current > dmg) {
        this.current -= dmg
    } else {
        this.current = 0
    }
}

HP.prototype.get = function() {
    return {
        max: this.max,
        current: this.current
    }
}

HP.prototype.isEmpty = function() {
    return this.current <= 0
}

module.exports = HP