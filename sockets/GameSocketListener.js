const randomWords = require('random-words')

const { getRandomLocation, getRandomRolesForLocation } = require('../helpers/gameInfoHelper')

class GameSocketListener {
    constructor(socketIoInstance, socket) {
        this.socketIo = socketIoInstance
        this.socket = socket

        this.createGame = this.createGame.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.startGame = this.startGame.bind(this)

        this.socket.on('create-game', this.createGame)
        this.socket.on('join-game', this.joinGame)
        this.socket.on('start-game', this.startGame)
    }

    static get ROOMSMEMBERLIST() {
        return GameSocketListener.roomsMemberList
    }

    static get ROOMSINFO() {
        return GameSocketListener.roomsInfo
    }

    static set ROOMSMEMBERLIST(newList) {
        GameSocketListener.roomsMemberList = newList
    }

    static set ROOMSINFO(newInfo) {
        GameSocketListener.roomsInfo = newInfo
    }

    createGame(hostName, theme) {
        const uniqueRoomName = randomWords({exactly: 2, maxLength: 9}).join('-')
        this.socket.join(uniqueRoomName)

        GameSocketListener.roomsMemberList[uniqueRoomName] = [hostName]
        GameSocketListener.roomsInfo[uniqueRoomName] = {theme}

        this.socketIo.to(uniqueRoomName).emit('message', `${hostName} has joined  ${uniqueRoomName} as host`)
        this.socketIo.to(uniqueRoomName).emit('message', `${uniqueRoomName} Room created`)
        this.socketIo.to(uniqueRoomName).emit('roster', GameSocketListener.roomsMemberList[uniqueRoomName])
    }

    joinGame(playerName, roomName) {
        this.socket.join(roomName)

        GameSocketListener.roomsMemberList[roomName].push(playerName)

        this.socketIo.to(roomName).emit('message', `${playerName} has joined ${roomName}`)
        this.socketIo.to(roomName).emit('roster', GameSocketListener.roomsMemberList[roomName])
    }

    startGame(roomName) {
        const theme = GameSocketListener.roomsInfo[roomName].theme
        const location = getRandomLocation(theme)

        const randomizedRoles = getRandomRolesForLocation(location, GameSocketListener.roomsMemberList[roomName].length)
        const sockets = Object.keys(this.socketIo.of('/').in(roomName).sockets)

        sockets.forEach((socketId, id) => {
            this.socketIo.to(socketId).emit('role', `your role is ${randomizedRoles[id]}`)
        })

        this.socketIo.to(roomName).emit('message', `Game has started in room ${roomName}`)
        this.socketIo.to(roomName).emit('roster', GameSocketListener.roomsMemberList[roomName])
        this.socketIo.to(roomName).emit('location', location)
    }
}

GameSocketListener.roomsMemberList = {}
GameSocketListener.roomsInfo = {}

module.exports = GameSocketListener
