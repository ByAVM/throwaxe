const { Server, Socket } = require("socket.io")
const Game = require("./base/Game")
const BaseLevel = require("./scenes/BaseLevel")

/**
 * 
 * @param {Server} wss 
 */
function GameServer(wss) {
    this.wss = wss
    wss.on('connection', this.bindClientEvents.bind(this))

    this.game = new Game(this, wss)
    this.game.setScene(new BaseLevel(this.game))

    this.gameInterval = setInterval(() => this.game.loop(), 32)
}

/**
 * 
 * @param {Socket} socket 
 */
GameServer.prototype.bindClientEvents = function(socket) {
    socket.on('join', this.handleJoin.bind(this, socket))
    
    socket.emit(
        'init',
        this.game.scene.getBullets(),
        this.game.scene.getPlayers(true),
        this.game.scene.getEnvironment()
    )
}

GameServer.prototype.handleJoin = function(socket, data) {
    let player = this.game.joinPlayer(data, socket)

    if (player) {
        console.log(`joined ${player.name}`)
        socket.emit(
            'joined',
            player.getState(true)
        )
        
        socket.broadcast.emit('playerJoined', player.getState(true))

        this.wss.send(`Игрок <b>${player.name}</b> подключился`)
    }
}

module.exports = GameServer