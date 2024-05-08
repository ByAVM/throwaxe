class Weapon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, rotation, texture = 'TAxe') {
        super(scene, x, y, texture)

        this.rotation = rotation
    }

    hide() {
        this.alpha = 0
    }

    show() {
        this.alpha = 1
    }
}