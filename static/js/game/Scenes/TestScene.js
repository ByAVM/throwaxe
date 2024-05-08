class TestScene extends Phaser.Scene {
    create() {
        this.cameras.main.centerOn(0, 0)

		this.player = null
        
        this.weaponsGroup = this.add.group({ runChildUpdate: true })
        this.enemyesGroup = this.add.group({ runChildUpdate: true })
        this.staticEnvironmentGroup = this.add.group()
        this.dynamicEnvironmentGroup = this.add.group({ runChildUpdate: true })

        this.terrain = this.add.layer([new Phaser.GameObjects.TileSprite(this, 0, 0, 1024, 1024, 'grass-2')])
        
        this.enemyesGroup.setDepth(3)
        this.staticEnvironmentGroup.setDepth(2)
        this.dynamicEnvironmentGroup.setDepth(2)

        this.initHandlers()
        
        this.game.events.emit('levelloaded')
    }

    initHandlers() {
        this.game.events.on('initEnvObject', obj => {
            this.staticEnvironmentGroup.add(new StaticObject(this, obj), true)
        })
        this.game.events.on('throwWeapon', bullet => {
            this.weaponsGroup.add(new Bullet(this, bullet), true)
        })

        this.game.events.on('addenemy', enemy => {
            this.enemyesGroup.add(new Enemy(this, enemy), true)
        })

        this.game.events.on('createBuff', buff => {
            this.dynamicEnvironmentGroup.add(new DynamicObject(this, buff), true)
        })

        this.game.events.on('createPlayer', player => {
            this.createPlayer(player)
        })
    }

    createPlayer(player) {
        this.player = new Player(this, player)
        this.add.existing(this.player)
    }
	
	update() {
		if (this.player) {
            this.player.update()
            this.cameras.main.centerOn(this.player.x, this.player.y)
        }
	}
}

