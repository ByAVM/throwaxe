function EventEmitter() {
    this.handlersMap = {}
}

EventEmitter.prototype.on = function(event, handler) {
    const evt = event.trim()

    if (this.handlersMap[evt]) {
        this.handlersMap[evt].push(handler)
    } else {
        this.handlersMap[evt] = [handler]
    }
}

EventEmitter.prototype.emit = function(event, ...args) {
    const evt = event.trim()

    if (this.handlersMap[evt]) {
        this.handlersMap[evt].forEach(handler => {
            handler.apply(null, args)
        })
    }
}

module.exports = EventEmitter