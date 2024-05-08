/**
 * 
 * @param {HTMLElement} container 
 */
function msgController(container) {
    this.container = container
}

const getTime = () => {
    const d = new Date()
    return `${d.getHours()}:${d.getMinutes()}`
}

msgController.prototype.template = function(msg) {
    const msgNode = document.createElement('div')
    msgNode.className = 'messages-container-message'

    const timeNode = document.createElement('div')
    timeNode.className = 'message-time'
    timeNode.textContent = getTime()
    
    msgNode.append(timeNode)
    const txtSpan = document.createElement('span')
    txtSpan.innerHTML = msg
    msgNode.append(txtSpan)

    return msgNode
}

msgController.prototype.add = function(msg) {
    const msgElement = this.template(msg)
    this.container.append(msgElement)
    
    this.container.scrollTo({
        top: msgElement.offsetTop,
        behavior: 'smooth'
    })

    if (this.container.children.length > 50) {
        this.container.removeChild(this.container.firstChild)
    }
}