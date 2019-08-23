const randomWords = require('random-words')

const gameInfoHelper = require('../helpers/gameInfoHelper')

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

  emitEvent(destination, ...emitParams) {
    this.socketIo.to(destination).emit(...emitParams)
  }

  createGame(hostName, theme) {
    const uniqueRoomName = randomWords({ exactly: 2, maxLength: 9 }).join('-')
    this.socket.join(uniqueRoomName)

    GameSocketListener.roomsMemberList[uniqueRoomName] = [hostName]
    GameSocketListener.roomsInfo[uniqueRoomName] = { theme }

    this.emitEvent(uniqueRoomName, 'message', `${hostName} has joined ${uniqueRoomName} as host`)
    this.emitEvent(uniqueRoomName, 'message', `${uniqueRoomName} Room created`)
    this.emitEvent(uniqueRoomName, 'roster', GameSocketListener.roomsMemberList[uniqueRoomName])
  }

  joinGame(playerName, roomName) {
    this.socket.join(roomName)

    GameSocketListener.roomsMemberList[roomName].push(playerName)

    this.emitEvent(roomName, 'message', `${playerName} has joined ${roomName}`)
    this.emitEvent(roomName, 'roster', GameSocketListener.roomsMemberList[roomName])
  }

  startGame(roomName) {
    const { theme } = GameSocketListener.roomsInfo[roomName]
    const location = gameInfoHelper.getRandomLocation(theme)
    const numberOfPlayers = GameSocketListener.roomsMemberList[roomName].length

    const randomizedRoles = gameInfoHelper.getRandomRolesForLocation(location, numberOfPlayers)
    const sockets = Object.keys(this.socketIo.of('/').in(roomName).sockets)

    sockets.forEach((socketId, id) => {
      this.emitEvent(socketId, 'role', `your role is ${randomizedRoles[id]}`)
    })

    this.emitEvent(roomName, 'message', `Game has started in room ${roomName}`)
    this.emitEvent(roomName, 'roster', GameSocketListener.roomsMemberList[roomName])
    this.emitEvent(roomName, 'location', location)
  }
}

GameSocketListener.roomsMemberList = {}
GameSocketListener.roomsInfo = {}

module.exports = GameSocketListener
