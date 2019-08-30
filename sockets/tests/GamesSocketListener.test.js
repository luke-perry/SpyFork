const sampleRandomRoomName = 'fancy-room'
const mockRandomWords = jest.fn().mockImplementation(() => (sampleRandomRoomName.split('-')))
const randomWords = require('random-words')

const GameSocketListener = require('../GameSocketListener')
const gameInfoHelper = require('../../helpers/gameInfoHelper')

jest.mock('random-words', () => (mockRandomWords))

describe('GameSocketListener', () => {
  const mockEmit = jest.fn()
  const mockSocketIo = { to: () => ({ emit: mockEmit }), of: () => ({ in: () => ({ sockets: { id1: {}, id2: {} } }) }) }
  const mockSocket = { join: jest.fn(), on: jest.fn() }

  const sampleHost = 'Host Guy'
  const sampleTheme = 'boring'
  const sampleMember = 'player peep'
  const sampleRoster = [sampleHost, sampleMember]

  let gameSocketListener

  beforeEach(() => {
    randomWords.exports = () => { }

    gameSocketListener = new GameSocketListener(mockSocketIo, mockSocket)
  })

  describe('#constructor', () => {
    it('should bind the class functions to the socket', () => {
      const myListener = new GameSocketListener(mockSocketIo, mockSocket)

      expect(mockSocket.on).toHaveBeenCalledWith('create-game', myListener.createGame)
      expect(mockSocket.on).toHaveBeenCalledWith('join-game', myListener.joinGame)
      expect(mockSocket.on).toHaveBeenCalledWith('start-game', myListener.startGame)
    })
  })
  
  describe('#createGame', () => {
    it('should join the socket to the room', () => {
      gameSocketListener.createGame(sampleHost, sampleTheme)

      expect(mockSocket.join).toHaveBeenCalledWith(sampleRandomRoomName)
    })

    it('should emit initial events for game creation', () => {
      gameSocketListener.createGame(sampleHost, sampleTheme)

      expect(mockEmit).toHaveBeenCalledWith('message', `Host Guy has joined ${sampleRandomRoomName} as host`)
      expect(mockEmit).toHaveBeenCalledWith('message', `${sampleRandomRoomName} Room created`)
      expect(mockEmit).toHaveBeenCalledWith('roster', [sampleHost])
    })
  })

  describe('#joinGame', () => {
    beforeEach(() => {
      GameSocketListener.roomsMemberList = {}
      GameSocketListener.roomsMemberList[sampleRandomRoomName] = [sampleHost]
    })

    it('should join the socket to the room', () => {
      gameSocketListener.joinGame(sampleMember, sampleRandomRoomName)

      expect(mockSocket.join).toHaveBeenCalledWith(sampleRandomRoomName)
    })

    it('should emit a welcome event and a roster event', () => {
      gameSocketListener.joinGame(sampleMember, sampleRandomRoomName)

      expect(mockEmit).toHaveBeenCalledWith('message', `player peep has joined ${sampleRandomRoomName}`)
      expect(mockEmit).toHaveBeenCalledWith('roster', sampleRoster)
    })
  })

  describe('#startGame', () => {
    const sampleRoomName = 'myRoom'
    const sampleLocation = 'bank'
    let mockGetLocation
    let mockGetRandomRoles

    beforeEach(() => {
      GameSocketListener.roomsInfo = { [sampleRoomName]: { theme: sampleTheme } }
      GameSocketListener.roomsMemberList[sampleRoomName] = sampleRoster

      mockGetLocation = jest.spyOn(gameInfoHelper, 'getRandomLocation').mockReturnValue(sampleLocation)
      mockGetRandomRoles = jest.spyOn(gameInfoHelper, 'getRandomRolesForLocation').mockReturnValue(['spy', 'teller'])
    })

    it('should use the game info helper to get the random location and roles', () => {
      gameSocketListener.startGame(sampleRoomName)

      expect(mockGetLocation).toHaveBeenCalledWith(sampleTheme)
      expect(mockGetRandomRoles).toHaveBeenCalledWith(sampleLocation, sampleRoster.length)
    })

    it('should emit a role event to each socket', () => {
      gameSocketListener.startGame(sampleRoomName)

      expect(mockEmit).toHaveBeenCalledWith('role', 'your role is spy')
      expect(mockEmit).toHaveBeenCalledWith('role', 'your role is teller')
    })

    it('should emit the appropriate events for to the entire room', () => {
      gameSocketListener.startGame(sampleRoomName)

      expect(mockEmit).toHaveBeenCalledWith('message', `Game has started in room ${sampleRoomName}`)
      expect(mockEmit).toHaveBeenCalledWith('roster', sampleRoster)
      expect(mockEmit).toHaveBeenCalledWith('location', sampleLocation)
    })
  })
})
