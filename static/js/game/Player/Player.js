class Player extends Phaser.GameObjects.Container  {
    constructor(scene, playerData) {
		const { position, name, skin, weapon, hp } = playerData
		super(scene, position.x, position.y)
		
		this.setDepth(3)
		this.setSize(64,64)

		this.info = new PlayerInfo(name, hp, scene, 0, -20)
		this.player = new PlayerContainer(skin, weapon, scene, 0, 0)

		this.add(this.player)
		this.add(this.info)

		this.scene.input.keyboard.on('keydown-SPACE', this.handleControls.bind(this, 'key-SPACE', true))
		this.scene.input.keyboard.on('keydown-W', this.handleControls.bind(this, 'key-W', true))
		this.scene.input.keyboard.on('keydown-A', this.handleControls.bind(this, 'key-A', true))
		this.scene.input.keyboard.on('keydown-S', this.handleControls.bind(this, 'key-S', true))
		this.scene.input.keyboard.on('keydown-D', this.handleControls.bind(this, 'key-D', true))
		
		this.scene.input.keyboard.on('keyup-SPACE', this.handleControls.bind(this, 'key-SPACE', false))
		this.scene.input.keyboard.on('keyup-W', this.handleControls.bind(this, 'key-W', false))
		this.scene.input.keyboard.on('keyup-A', this.handleControls.bind(this, 'key-A', false))
		this.scene.input.keyboard.on('keyup-S', this.handleControls.bind(this, 'key-S', false))
		this.scene.input.keyboard.on('keyup-D', this.handleControls.bind(this, 'key-D', false))
    }

    handleControls(evt, isPressed) {
        remoteController.io.emit(evt, isPressed)
    }

    update() {
		const player = remoteController.player
		this.x = player.position.x
		this.y = player.position.y
		this.player.rotation = player.rotation

		this.player.setOvercolor(player.tint)

		this.info.updateHp(player.hp.max, player.hp.current)

		if (player.weaponReady) {
			this.player.showWeapon()
		} else {
			this.player.hideWeapon()
		}
    }

}