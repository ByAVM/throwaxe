const Player = require("./Player")

const genId = () => Math.ceil(Math.random() * 10237)

function Game(server, wss, scene = null) {
	this.server = server
    this.wss = wss
    this.scene = null

    if (scene) {
        this.setScene(scene)
    }
}

Game.prototype.setScene = function(scene) {
    this.scene = scene
}

Game.prototype.loop = function() {
    if (!this.scene) return
    
    try {
        this.scene.update()

        this.wss.emit('update', {
            bullets: Object.fromEntries(this.scene.getBullets().map(b => [ b.id, b ])),
            players: Object.fromEntries(this.scene.getPlayers().map(p => [ p.id, p ]))
        })
    } catch (e) {
        console.log(e)
    }
}

Game.prototype.joinPlayer = function(playerData, socket) {
    let player = this.getPlayer(playerData)

    if (player && player.isActive()) {
        socket.send('Такой игрок уже есть')

        return false
    } else if (player && !player.isActive()) {
        player.updateInfo(playerData)
        player.setSocket(socket)

        return player
    } else {
        const player = new Player(genId(), playerData, socket, this.scene)
        this.scene.addPlayer(player)

        return player
    }
}

Game.prototype.getPlayer = function(playerData) {
    return this.scene.players.find(player => player.name == playerData.name)
}

module.exports = Game