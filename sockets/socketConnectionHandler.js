const GameSocketListener = require('./GameSocketListener')

const socketConnectionHandler = (socketIo) => {
  socketIo.on('connection', (socket) => {
    new GameSocketListener(socketIo, socket)
    socket.emit('message', 'Welcome to Spyfell')
  })
}

module.exports = {
  socketConnectionHandler,
}
