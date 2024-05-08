const Environment = require("../base/Environment");

function Stone(scene, x, y, width, height) {
    const texture = 'stone'

    Environment.call(this, scene, x, y, width, height, texture)
}

Stone.prototype = Environment.prototype
Stone.prototype.constructor = Stone


module.exports = Stone