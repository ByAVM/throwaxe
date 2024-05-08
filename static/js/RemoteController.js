function RemoteController(msgController) {
    this.io = null

    this.game = null

    this.player = {
        position: {x: 0, y: 0},
        rotation: 0
    }
    this.playerId = this.getFromStorage('playerid')

    this.enemyes = {}
    this.bullets = {}

    this.buffs = {}

    this.msg = msgController
}

RemoteController.prototype.connect = function() {
    const ioHost = new URL(window.location)
    ioHost.port = 3535
    this.io = io(ioHost.href)

    this.io.on('joined', player => {
        this.initPlayer(player)        
    })

    this.io.on('init', (bullets, players, environment) => {
        this._initListeners()
        this.initBullets(bullets)
        this.initEnemyes(players)
        this.initEnvironment(environment)
    })
}

RemoteController.prototype.sendJoin = function(playerName, playerSkin, playerWeapon) {
    this.io.emit('join', {
        name: playerName,
        playerSkin: playerSkin,
        weaponSkin: playerWeapon
    })
}

RemoteController.prototype.initPlayer = function(player) {
    this.playerId = player.id
    this.setToStorage('playerid', this.playerId)
    
    this.player = player
    this.game.events.emit('createPlayer', this.player)
}

RemoteController.prototype.initBullets = function(bullets) {
    Object.values(bullets).forEach(bullet => {
        this.initBullet(bullet)
    });
}
RemoteController.prototype.initEnemyes = function(enemyes) {
    Object.values(enemyes).forEach(enemy => {
        if (enemy.id == this.playerId) return
        this.initEnemy(enemy)
    })
}

RemoteController.prototype.initEnvironment = function(env) {
    console.log('Init envs')

    env.static.forEach(e => {
        this.game.events.emit('initEnvObject', e)
    })

    env.dynamic.forEach(e => {
        this.buffs[e.id] = e
        this.game.events.emit('createBuff', e)
    })
}

RemoteController.prototype.initEnemy = function(enemy) {
    this.game.events.emit('addenemy', enemy)
    this.enemyes[enemy.id] = enemy
}

RemoteController.prototype.initBullet = function(bullet) {
    this.game.events.emit('throwWeapon', bullet)
    this.bullet[bullet.id] = bullet
}

RemoteController.prototype._initListeners = function() {
    this.io.on('playerJoined', enemy => {
        this.initEnemy(enemy)
    })

    this.io.on('throwBullet', bullet => {
        this.bullets[bullet.id] = bullet
        this.game.events.emit('throwWeapon', bullet)
    })

    this.io.on('deleteBullet', bId => {
        if (this.bullets[bId]) {
            delete this.bullets[bId]
        }
    })

    this.io.on('deleteBuff', bId => {
        if (this.buffs[bId]) {
            delete this.buffs[bId]
        }
    })

    this.io.on('createBuff', buff => {
        this.buffs[buff.id] = buff
        this.game.events.emit('createBuff', buff)
    })

    this.io.on('update', ({ players, bullets }) => {
        Object.assign(this.player, players[this.playerId])
        delete players[this.playerId]

        this.bullets = bullets
        this.enemyes = players
    })

    this.io.on('message', t => this.msg.add(t))
}

RemoteController.prototype.getPlayerId = function() {
    return this.getFromStorage('playerid')
}
RemoteController.prototype.setPlayerId = function(id) {
    return this.setToStorage('playerid', id)
}

RemoteController.prototype.getFromStorage = function(key) {
    return localStorage.getItem(key)
}

RemoteController.prototype.setToStorage = function(key, value) {
    return localStorage.setItem(key, value)
}

RemoteController.prototype.setGame = function(game) {
    this.game = game
}