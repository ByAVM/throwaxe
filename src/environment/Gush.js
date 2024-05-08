const Environment = require("../base/Environment");

function Gush(scene, x, y, width, height) {
    const texture = 'gush'

    Environment.call(this, scene, x, y, width, height, texture)
}

Gush.prototype = Environment.prototype
Gush.prototype.constructor = Gush


module.exports = Gush