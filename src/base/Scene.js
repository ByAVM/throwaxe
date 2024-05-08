const HIT_DISTANCE = 48

const dist = (p1, p2) => {
    return Math.sqrt( Math.pow( p2.x - p1.x, 2) + Math.pow( p2.y - p1.y, 2))
}

const rand = (max, min = 0) => min + Math.ceil(Math.random() * max)

const Buff = require('./Buff')
const HealBuff = require('../buff/HealBuff')
const SpeedBuff = require('../buff/SpeedBuff')
const CooldownBuff = require('../buff/CooldownBuff')
const EventEmitter = require('./Util/EventEmitter')

const buffMap = {
    'heal': HealBuff,
    'speed': SpeedBuff,
    'cooldown': CooldownBuff
}

function Scene(game) {
    this.game = game
    this.players = []
    this.bullets = []
    this.envObjects = []
    this.buffs = []

    this._bounds = {
        left: -512,
        top: -512,
        right: 512,
        bottom: 512,
        width: 1024,
        height: 1024
    }

    this.ee = new EventEmitter()

    this.ee.on('generateBuff', () => {
        const buffs = Object.keys(buffMap)
        const randInt = Math.round(Math.random() * (buffs.length - 1))
        this.createBuff(buffs[randInt])
        console.log(`Created ${buffs[randInt]} buff`)
    })

    setInterval(() => {
        if (this.buffs.length < 3) {
            this.createBuff('heal')
        }
    }, 60000)
}

Scene.prototype.update = function() {
    this.players.forEach((p, i) => {
        if (!p.isActive()) {
            p.updateUnactive()

            if (p.isLeave()) {
                console.log('Removed player', p.name)
                setTimeout(() => this.removePlayer(i), 1)
            }
            return
        }
        p.update()
        
        this.controllBuffs(p)
        this.controlPlayerBullets(p)
    })
    
    this.bullets.forEach((b, i) => {
        if (b.isDead()) {
            setTimeout(() => this.removeBullet(i), 1)
            return
        }

        b.update(this.envObjects)
    })
}

const debug = (socket, msg) => {
    socket.emit('debug', msg)
}

Scene.prototype.controllBuffs = function(player) {
    this.buffs.forEach((buff, i) => {
        const { x, y } = player.position.get()
        if (buff.checkCollision(x, y)) {
            // debug(this.game.wss, {text: 'collision', data: [x, y]})
            player.applyBuff(buff)
            setTimeout(() => this.removeBuff(i), 1)
        }
    })
}

Scene.prototype.removeBuff = function(buffIndex) {
    this.game.wss.emit('deleteBuff', this.buffs[buffIndex].id)
    this.buffs.splice(buffIndex, 1)
}

Scene.prototype.addPlayer = function(player) {
    this.ee.emit('playerConnected', player)
    this.players.push(player)
}

Scene.prototype.addBullet = function(bullet) {
    this.bullets.push(bullet)
    this.game.wss.emit('throwBullet', bullet.getState())
}

Scene.prototype.removeBullet = function(bulletIndex) {
    this.game.wss.emit('deleteBullet', this.bullets[bulletIndex].id)
    this.bullets.splice(bulletIndex, 1)
}

Scene.prototype.removePlayer = function(playerIndex) {
    this.players.splice(playerIndex, 1)
}

Scene.prototype.getBounds = function() {
    return this._bounds
}

Scene.prototype.controlPlayerBullets = function(player) {
    this.bullets.forEach((b, i) => {
        if (!b.isActive()) return

        const distance = dist(player.position.get(), b)

        if (distance < HIT_DISTANCE) {
            if (player.hit(b)) {
                this.removeBullet(i)
            }
        }
    })
}

Scene.prototype.getBullets = function() {
    return this.bullets.map(b => b.getState())
}

Scene.prototype.getPlayers = function(full = false) {
    return this.players.map(p => p.getState(full))
}

Scene.prototype.getEnvironment = function() {
    return {
        static: this.envObjects.map(e => e.get()),
        dynamic: this.buffs.map(b => b.get())
    }
}

Scene.prototype.getRandomPoint = function(pointWidth = 0, pointHeight = 0) {
    const { left, top, right, bottom, width, height } = this.getBounds()

    let nX, nY
    let collisionExists = false

    do {
        collisionExists = false

        nX = rand(width, left)
        nY = rand(height, top)

        if (nX + pointWidth > right || nY + pointHeight > bottom) {
            collisionExists = true
            continue
        }
        
        for (let env of this.envObjects) {
            if (env.checkCollision(nX, nY, pointWidth, pointHeight)) {
                collisionExists = true
                break
            }
        }
    } while (collisionExists)

    return { x: nX, y: nY }
}

Scene.prototype.createBuff = function(type) {
    const { x, y } = this.getRandomPoint(64, 64)

    const buffClass = buffMap[type] || Buff
    
    const buff = new buffClass(x, y)
    
    this.buffs.push(buff)
    this.game.wss.emit('createBuff', buff.get())
}

module.exports = Scene