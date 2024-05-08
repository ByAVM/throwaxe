const HP_W = 60
const HP_FILL_W = 56

class HP extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)

        this.base = new Phaser.GameObjects.Rectangle(scene, x, y, HP_W, 14, 0xeeeeee)
        this.fill = new Phaser.GameObjects.Rectangle(scene, x, y, HP_FILL_W, 10, 0x33ff33)

        this.text = new Phaser.GameObjects.Text(scene, x, y, '100/100', {
            fontSize: '10px', color: '#3e3e3e'
        })
        this.text.x = this.text.x - this.text.width / 2
        this.text.y = this.text.y - this.text.height / 2

        this.add(this.base)
        this.add(this.fill)
        this.add(this.text)

        window.up = this.update.bind(this)
    }

    update(max, current) {
        this.text.setText(`${current}/${max}`)
        this.fill.width = current / max * HP_FILL_W
    }
}