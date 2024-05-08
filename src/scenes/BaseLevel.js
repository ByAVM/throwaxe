const Gush = require("../environment/Gush");
const Stone = require("../environment/Stone");
const Scene = require("../base/Scene");
const Buff = require("../base/Buff");

function BaseLevel(game) {
    Scene.call(this, game)

    this.envObjects = [
        new Gush(this, 64, 64, 2, 1),
        new Gush(this, -256, 0, 1, 3),
        new Gush(this, 192, -256, 3, 1),
        new Stone(this, -64, 192, 1, 1),
        new Stone(this, -192, -368, 1, 1),
    ]

}

BaseLevel.prototype = Scene.prototype
BaseLevel.prototype.constructor = BaseLevel


module.exports = BaseLevel
