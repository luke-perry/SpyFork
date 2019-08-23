const socketConnectionHandler = require('../socketConnectionHandler')
const GameSocketListener = require('../GameSocketListener')

jest.mock('../GameSocketListener')

describe('socketConnectionHandler', () => {
  describe('#socketConnectionHandler', () => {
    let mockSocketIo
    let mockSocket

    beforeEach(() => {
      const mockConnection = (txt, anonFunc) => {
        anonFunc(mockSocket)
      }

      mockSocketIo = { on: mockConnection }
      mockSocket = { emit: jest.fn() }
    })

    it('should instantiate a new lister', () => {
      socketConnectionHandler.socketConnectionHandler(mockSocketIo)

      expect(GameSocketListener).toHaveBeenCalledTimes(1)
    })

    it('should emit a new welcome event', () => {
      socketConnectionHandler.socketConnectionHandler(mockSocketIo)

      expect(mockSocket.emit).toHaveBeenCalledWith('message', 'Welcome to Spyfell')
    })
  })
})
