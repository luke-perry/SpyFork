const expressApp = require('express')()
const httpServer = require('http').createServer(expressApp)
const socketIo = require('socket.io')(httpServer)

const { socketConnectionHandler } = require('./sockets/socketConnectionHandler')

const port = 8080

httpServer.listen(port, () => {
  console.log(`running at port ${port}`);
})

socketConnectionHandler(socketIo)
