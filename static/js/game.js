function initSkins() {
    const getLoader = (loader) => {
        return fetch(`resources/loader/${loader}.json`)
            .then(resonse => resonse.json())
            .then(data => data[loader].files)
            .catch(e => console.log(e))
            .finally(() => {
                document.querySelector('.skins-selector').classList.remove('loading')
            })
    }

    const createSkinItem = (type, skin) => {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = `${type}-skin`
        radio.id = `${type}-skin-${skin.key}`
        radio.value = skin.key
        radio.checked = skin.default || false

        const label = document.createElement('label')
        label.setAttribute('for', `${type}-skin-${skin.key}`)

        const img = document.createElement('img')
        img.src = skin.url
        label.append(img)

        const node = document.createElement('div')
        node.className = 'skin-select-item'

        node.append(radio, label)
        return node
    }

    getLoader('players')
        .then(players => {
            const pSkinsContainer = document.getElementById('player-skins')
            players.forEach(skin => {
                const node = createSkinItem('player', skin)
                pSkinsContainer.append(node)
            })
        })

    getLoader('weapons')
        .then(weapons => {
            const wSkinsContainer = document.getElementById('weapon-skins')
            weapons.forEach(skin => {
                const node = createSkinItem('weapon', skin)
                wSkinsContainer.append(node)
            })
        })
}

function initInterface() {
    initSkins()

    const interface = document.querySelector('.game-interface')

    const authForm = document.getElementById('authForm')

    authForm.addEventListener('submit', e => {
        e.preventDefault()
        const fData = new FormData(e.target)

        const playerName = fData.get('player-name')
        const skin = fData.get('player-skin')
        const weapon = fData.get('weapon-skin')

        if (playerName.length <= 0 || playerName == '') return

        interface.classList.add('hidden')

        // Send nickname
        remoteController.sendJoin(playerName.trim(), skin.trim(), weapon.trim())
    })
}


document.addEventListener('DOMContentLoaded', () => {
    const msg = new msgController(document.getElementById('messages'))
    const remoteController = new RemoteController(msg)
    window.remoteController = remoteController

    initInterface()
    
    const gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 500,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        },
        scene: [
            new PreloadScene({
                active: true,
                key: 'preload'
            }),
            new TestScene({
                key: 'test',
            })
        ],
        parent: 'canvas-container'
    }

    const game = new Phaser.Game(gameConfig)

    window.game = game

    game.events.on('levelloaded', () => {
        remoteController.setGame(game)

        remoteController.connect()

        const debugBar = document.createElement('div')
        debugBar.className = 'debug-bar'
        document.body.append(debugBar)

        remoteController.io.on('debug', d => {
            debugBar.innerHTML = `<b>${d.text}</b><pre>${JSON.stringify(d.data)}</pre>`
        })
    })
})
