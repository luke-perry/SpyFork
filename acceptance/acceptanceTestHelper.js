const ioClient = require('socket.io-client')

const setupGame = (serverDetails) => {
  const client = ioClient(`http://localhost:${serverDetails.port}/`)

  client.emit('create-game', 'John Doe', 'boring')

  return new Promise(
    (resolve) => {
      client.on('message', (response) => {
        if (response.includes('Room created')) {
          client.disconnect()
          resolve(response.split(' ')[0])
        }
      })
    },
  )
}

module.exports = {
  setupGame,
}
