class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, weapon) {
        const { id, rotation, texture, x, y } = weapon
        super(scene, x, y, texture)

        this.id = id
        this.active = true
        this.rotation = rotation
    }

    update() {
        const bullet = remoteController.bullets[this.id]
        if (bullet) {
            const { x, y } = bullet
            this.x = x
            this.y = y
            
            if (bullet.isActive) {
                this.rotation -= 0.17
            }
        } else {
            this.destroy()
        }
    }
}