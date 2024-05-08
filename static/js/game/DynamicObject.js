class DynamicObject extends Phaser.GameObjects.Sprite {
    constructor(scene, object) {
        const { id, x, y, texture } = object
        super(scene, x, y, texture)

        this.setOrigin(0)

        this.id = id

        // this.debug = new Phaser.GameObjects.Ellipse(scene, x, y, 5, 5, 0xff0000)
        // this.debug.depth = 5
        // this.scene.add.existing(this.debug)
    }

    update() {
        const buff = remoteController.buffs[this.id]
        if (!buff) {
            this.destroy()
            // this.debug.destroy()
        }
    }
}