class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(player='TWiking', weapon='TAxe', scene, x, y) {
        super(scene, x, y)

        this.weapon = new Weapon(scene, 18, 30, 1.57, weapon)
        this.playerSprite = new Phaser.GameObjects.Image(scene, 0, 0, player)

        this.add(this.weapon)
        this.add(this.playerSprite)
    }

    setOvercolor(tint) {
        this.playerSprite.setTint(tint)
    }
    showWeapon() {
        this.weapon.show()
    }
    hideWeapon() {
        this.weapon.hide()
    }
}