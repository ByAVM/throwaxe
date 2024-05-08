const { Socket } = require('socket.io')

const Position = require('./Util/Position')
const Rotation = require('./Util/Rotation')
const Controls = require('./Util/Controls')
const HP = require('./Util/HP')
const Weapon = require('./Weapon')

const PI = Math.PI
const PI_2 = PI / 2

const UNACTIVE_TIME = 1000

const TINT = {
    BASE: {
        color: 0xffffff
    },
    HEAL: {
        color: 0x33bb33,
        time: 1000
    },
    DAMAGE: {
        color: 0x883333,
        time: 300
    }
}

/**
 * @param {String} id 
 * @param {Socket} socket
 * 
 * @property {Socket} socket
 */
function Player(id, conf, socket, scene) {
    this.id = id
    this.scene = scene

    this.ee = scene.ee

    this.speed = 3
    this.name = conf.name || 'Hero'

    this.skin = conf.playerSkin || 'TWiking'

    this.position = new Position()
    this.rotation = new Rotation()
    this.weapon = new Weapon(scene, this, conf.weaponSkin || 'TAxe')
    this.controls = new Controls()
    this.hp = new HP(100)
    
    this.socket = null

    this.unactiveTime = UNACTIVE_TIME

    this.tint = TINT['BASE'].color

    this.setSocket(socket)
    this.spawn()
}


Player.prototype.setSocket = function(socket) {
    if (this.socket) {
        this.socket.disconnect(true)
    }

    this.socket = socket

    this.initControls()
    this.unactiveTime = UNACTIVE_TIME
}

Player.prototype.updateUnactive = function() {
    if (this.isActive() == false) {
        this.unactiveTime--
    }
}

Player.prototype.handleControls = function() {
    // Movement
    const { left, right, top, down, space } = this.controls.get()

    if (left || right || top || down) {
        // Position and rotation
        const { x, y } = this.position.get()

        let targetRotation = this.rotation.get()

        if (left) {
            targetRotation = PI
        } else if (right) {
            targetRotation = 0
        }

        if (top) {
            targetRotation = PI + PI_2
        } else if (down) {
            targetRotation = PI_2
        }

        if (top && right) {
            targetRotation = PI + PI_2 + PI_2 / 2
        } else if (top && left) {
            targetRotation = PI + PI_2 / 2
        } else if (left && down) {
            targetRotation = PI - PI_2 / 2
        } else if (down && right) {
            targetRotation = PI_2 / 2
        }

        let nX = x + this.speed * Math.cos(targetRotation)
        let nY = y + this.speed * Math.sin(targetRotation)
        // *Position and rotation*

        // Bounds control
        const bounds = this.scene.getBounds()
        if (nX > bounds.right) {
            nX = bounds.right
        } else if (nX < bounds.left) {
            nX = bounds.left
        }

        if (nY < bounds.top) {
            nY = bounds.top
        } else if (nY > bounds.bottom) {
            nY = bounds.bottom
        }
        // *Bounds control*

        // Environments control
        this.scene.envObjects.forEach(env => {
            if (env.checkCollision(x, nY)) {
                nY = y
            }

            if (env.checkCollision(nX, y)) {
                nX = x
            }

            if (env.checkCollision(nX, nY)) {
                nX = x
                nY = y
            }
        })
        // *Environments control*

        this.position.update(nX, nY)
        this.rotation.update(targetRotation, true)
    }

    // Throwing Weapon
    if (this.weapon.getReady() && space) {
        const bullet = this.weapon.throwDirectly({ ...this.position }, this.rotation.get())
        this.scene.addBullet(bullet)
    }
}

Player.prototype.initControls = function() {
    this.socket.on('key-W', state => this.controls.set('top', state))
	this.socket.on('key-A', state => this.controls.set('left', state))
	this.socket.on('key-S', state => this.controls.set('down', state))
	this.socket.on('key-D', state => this.controls.set('right', state))
	this.socket.on('key-SPACE', state => this.controls.set('space', state))

    this.socket.on('disconnected', () => {
        this.wss.send(`Игрок <b>${this.name}</b> отключился`)
    })
}

Player.prototype.updateInfo = function(data) {
	this.skin = data.playerSkin
    this.weapon.texture = data.weaponSkin
}

Player.prototype.update = function() {
    this.handleControls()
}

Player.prototype.getState = function(full = false) {
    if (full) {
        return {
            position: this.position.get(),
            rotation: this.rotation.get(),
            id: this.id,
            weaponReady: this.weapon.getReady(),
            active: this.isActive(),
            hp: this.hp.get(),
            name: this.name,
            skin: this.skin,
            weapon: this.weapon.texture,
            tint: this.tint
        }
    } else {
        return {
            position: this.position.get(),
            rotation: this.rotation.get(),
            id: this.id,
            weaponReady: this.weapon.getReady(),
            active: this.isActive(),
            hp: this.hp.get(),
            tint: this.tint
        }
    }
}

Player.prototype.isActive = function() {
    return !this.socket.disconnected
}

Player.prototype.isLeave = function() {
    return this.unactiveTime <= 0
}

Player.prototype.hit = function(bullet) {
    if (bullet.player.id == this.id) return false

    this.setTint(TINT['DAMAGE'])

    this.hp.hit(bullet.damage)

    if (this.hp.isEmpty()) {
        this.socket.emit('playerIsDead')
        this.scene.game.wss.emit('message', `Игрок <b class="die">${this.name}</b> убит игроком <b class="killer">${bullet.player.name}</b>`)

        this.hp.heal(this.hp.max - 1, true)

        this.ee.emit('generateBuff')

        this.spawn()

        this.setTint(TINT['HEAL'])
    }

    return true
}

Player.prototype.setTint = function(tint) {
    this.tint = tint.color

    setTimeout(() => {
        this.tint = TINT['BASE'].color
    }, tint.time)
}

Player.prototype.spawn = function(random = true, x = 0, y = 0) {
    if (random) {        
        const { x, y } = this.scene.getRandomPoint()

        this.position.update(x, y)
    } else {
        this.position.update(x, y)
    }
}

Player.prototype.applyBuff = function(buff) {
    buff.useEffect(this)
}

module.exports = Player