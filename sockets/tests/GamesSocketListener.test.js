const sampleRandomRoomName = 'fancy-room'
const mockRandomWords = jest.fn().mockImplementation(() => (sampleRandomRoomName.split('-')))
const randomWords = require('random-words')

const GameSocketListener = require('../GameSocketListener')

jest.mock('random-words', () => (mockRandomWords))

describe('GameSocketListener', () => {
  const mockEmit = jest.fn()
  const socketIoMock = { to: () => ({ emit: mockEmit }) }
  const socketMock = { join: jest.fn(), on: jest.fn() }

  const sampleHost = 'Host Guy'
  const sampleTheme = 'boring'

  let gameSocketListener

  beforeEach(() => {
    randomWords.exports = () => { }

    gameSocketListener = new GameSocketListener(socketIoMock, socketMock)
  })

  describe('#constructor', () => {
    it('should bind the class functions to the socket', () => {
      const myListener = new GameSocketListener(socketIoMock, socketMock)

      expect(socketMock.on).toHaveBeenCalledWith('create-game', myListener.createGame)
      expect(socketMock.on).toHaveBeenCalledWith('join-game', myListener.joinGame)
      expect(socketMock.on).toHaveBeenCalledWith('start-game', myListener.startGame)
    })
  })

  describe('#createGame', () => {
    it('should join the socket to the room', () => {
      gameSocketListener.createGame(sampleHost, sampleTheme)

      expect(socketMock.join).toHaveBeenCalledWith(sampleRandomRoomName)
    })

    it('should emit initial events for game creation', () => {
      gameSocketListener.createGame(sampleHost, sampleTheme)

      expect(mockEmit).toHaveBeenCalledWith('message', `Host Guy has joined ${sampleRandomRoomName} as host`)
      expect(mockEmit).toHaveBeenCalledWith('message', `${sampleRandomRoomName} Room created`)
      expect(mockEmit).toHaveBeenCalledWith('roster', [sampleHost])
    })
  })

  describe('#joinGame', () => {
    const sampleMember = 'player peep'
    const sampleRoster = [sampleHost, sampleMember]

    beforeEach(() => {
      GameSocketListener.roomsMemberList = {}
      GameSocketListener.roomsMemberList[sampleRandomRoomName] = [sampleHost]
    })

    it('should join the socket to the room', () => {
      gameSocketListener.joinGame(sampleMember, sampleRandomRoomName)

      expect(socketMock.join).toHaveBeenCalledWith(sampleRandomRoomName)
    })

    it('should emit a welcome event and a roster event', () => {
      gameSocketListener.joinGame(sampleMember, sampleRandomRoomName)

      expect(mockEmit).toHaveBeenCalledWith('message', `player peep has joined ${sampleRandomRoomName}`)
      expect(mockEmit).toHaveBeenCalledWith('roster', sampleRoster)
    })
  })

  describe('#startGame', () => {

  })
})
