class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, enemy) {
        const { id, position, name, skin, weapon, hp } = enemy
        super(scene, position.x, position.y)
        this.id = id
        
        this.setSize(64,64)
        
        this.info = new PlayerInfo(name, hp, scene, 0, -20)
        this.player = new PlayerContainer(skin, weapon, scene, 0, 0)
        

        this.add(this.player)
		this.add(this.info)
    }

    update() {
        const enemy = remoteController.enemyes[this.id]
        
        if (enemy && enemy.active) {
            const { x, y } = enemy.position
            this.x = x
            this.y = y
            this.player.rotation = enemy.rotation

            this.player.setOvercolor(enemy.tint)

            this.info.updateHp(enemy.hp.max, enemy.hp.current)

            if (enemy.weaponReady) {
                this.player.showWeapon()
            } else {
                this.player.hideWeapon()
            }

        } else {
            this.destroy()
        }
    }
}