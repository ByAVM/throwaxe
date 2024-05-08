class PreloadScene extends Phaser.Scene {
    preload() {
        this.load.pack('environment', 'resources/loader/environment.json')
        this.load.pack('players', 'resources/loader/players.json')
        this.load.pack('weapons', 'resources/loader/weapons.json')
    }

    create() {
        this.game.scene.stop('preload')
        this.game.scene.start('test')
    }
}