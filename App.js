const expressApp = require('express')()
const httpServer = require('http').createServer(expressApp)
const socketIo = require('socket.io')(httpServer)
const randomWords = require('random-words')

const { getRandomLocation, getRandomRolesForLocation } = require('./helpers/gameInfoHelper')

const port = 8080

httpServer.listen(port, () => {
  console.log(`running at port ${port}`);
})

const roomsMemberList = {}
const roomsInfo = {}

socketIo.on('connection', (socket) => {
    console.log('------- joined session')
    socket.emit('message', "Welcome to Spyfork")

    socket.on('create-game', (hostName, theme) => {
        const uniqueRoomName = randomWords({exactly: 2, maxLength: 9}).join('-')
        console.log('------- created', hostName)
        socket.join(uniqueRoomName)

        roomsMemberList[uniqueRoomName] = [hostName]
        roomsInfo[uniqueRoomName] = {theme}

        socketIo.to(uniqueRoomName).emit('message', `${hostName} has joined  ${uniqueRoomName} as host`)
        socketIo.to(uniqueRoomName).emit('message', `${uniqueRoomName} Room created`)
        socketIo.to(uniqueRoomName).emit('roster', roomsMemberList[uniqueRoomName])
    })

    socket.on('join-game', (playerName, roomName) => {
        console.log('------- joined game', playerName)
        socket.join(roomName)

        roomsMemberList[roomName].push(playerName)

        socketIo.to(roomName).emit('message', `${playerName} has joined ${roomName}`)
        socketIo.to(roomName).emit('roster', roomsMemberList[roomName])
    })

    socket.on('start-game', (roomName) => {
        console.log('------- game started')

        const theme = roomsInfo[roomName].theme
        const location = getRandomLocation(theme)

        const randomizedRoles = getRandomRolesForLocation(location, roomsMemberList[roomName].length)
        const sockets = Object.keys(socketIo.of('/').in(roomName).sockets)

        sockets.forEach((socketId, id) => {
            socketIo.to(socketId).emit('role', `your role is ${randomizedRoles[id]}`)
        })

        socketIo.to(roomName).emit('message', `Game has started in room ${roomName}`)
        socketIo.to(roomName).emit('roster', roomsMemberList[roomName])
        socketIo.to(roomName).emit('location', location)
    })
})
