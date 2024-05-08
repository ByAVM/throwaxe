const { createServer } = require('http');
const fs = require('fs')
const url = require('url')
const path = require('path')
const { Server } = require('socket.io')

const GameServer = require('./src/GameServer.js');

const SOCKET_PORT = 3535
const STATIC_PORT = 3534
const HOST = '0.0.0.0'


const wss = new Server(SOCKET_PORT, { cors: { origin: '*' }})
const gameServer = new GameServer(wss)

const server = createServer((req, res) => {
  const parsedUrl = url.parse(req.url)
  let pathName = `./static${parsedUrl.pathname}`
  const ext = path.parse(pathName).ext || '.html'

  const map = {
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.html': 'text/html',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ico': 'image/x-icon',
    '.css': 'text/css',
    '.json': 'application/json'
  }

  fs.stat(pathName, (err, stats) => {
    if (err) {
      res.statusCode = 404
      res.end(`File ${pathName} not found!`)
      return
    }

    if (stats.isDirectory()) {
      pathName += '/index' + ext
    }

    fs.readFile(pathName, (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      } else {
        res.setHeader('Content-Type', map[ext] || 'text/plain')
        res.end(data)
      }
    })
  })
})

server.on('connect', (req) => {
  console.log('connect')
})
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(STATIC_PORT, HOST);
    }, 1000);
  }
})

server.listen(STATIC_PORT, HOST)

console.log(`Server listening on port: ${STATIC_PORT}`)
