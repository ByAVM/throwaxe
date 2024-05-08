class StaticObject extends Phaser.GameObjects.TileSprite {
    constructor(scene, object) {
        const { x, y, width, height, texture } = object
        super(scene, x, y, width, height, texture)

        this.setOrigin(0)
    }
}