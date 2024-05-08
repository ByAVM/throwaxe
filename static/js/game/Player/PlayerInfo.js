class PlayerInfo extends Phaser.GameObjects.Container {
    constructor(name, hp, scene, x, y) {
        super(scene, x, y)

        this.name = new Phaser.GameObjects.Text(scene, 0, -45, name, {
            fontSize: '14px'
        })
        this.name.x -= this.name.width / 2

        this.hp = new HP(scene, 0, -10)

        this.add(this.name)
        this.add(this.hp)
    }

    updateHp(max, current) {
        this.hp.update(max, current)
    }
}