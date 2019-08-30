const ioClient = require('socket.io-client')
const setupWildCardListening = require('socketio-wildcard')(ioClient.Manager)

const server = require('../App')
const { setupGame } = require('./acceptanceTestHelper')

describe('socketEvents', () => {
  let serverDetails
  let testClient
  let responses

  beforeAll(() => {
    serverDetails = server.httpServer.address()
  })

  afterAll((done) => {
    server.httpServer.close()
    done()
  })

  beforeEach((done) => {
    responses = []

    testClient = ioClient(`http://localhost:${serverDetails.port}/`)
    setupWildCardListening(testClient)
    testClient.on('connect', () => { done() })
  })

  afterEach((done) => {
    if (testClient.connected) testClient.disconnect()
    done()
  })

  describe('create-game client event', () => {
    it('should emit events that the room is created, its host, and its roster', async (done) => {
      testClient.emit('create-game', 'John Doe', 'boring')
      testClient.on('*', (response) => {
        responses.push(response.data[1])

        if (responses.length > 3) {
          expect(responses[1]).toEqual(expect.stringMatching(/John Doe has joined \S+-\S+ as host/))
          expect(responses[2]).toEqual(expect.stringMatching(/\S+-\S+ Room created/))
          expect(responses[3]).toEqual(['John Doe'])
          done()
        }
      })
    })
  })

  describe('join-game client event', () => {
    it('should emit events that the room is created, its host, and its roster', async (done) => {
      const roomName = await setupGame(serverDetails)

      testClient.emit('join-game', 'Jane Doe', roomName)
      testClient.on('*', (response) => {
        responses.push(response.data[1])

        if (responses.length > 1) {
          expect(responses[0]).toEqual(`Jane Doe has joined ${roomName}`)
          expect(responses[1]).toEqual(['John Doe', 'Jane Doe'])
          done()
        }
      })
    })
  })

  describe('start-game client event', () => {
    it('should emit events that game is started and the roster', async (done) => {
      const roomName = await setupGame(serverDetails)
      testClient.emit('join-game', 'Jane Doe', roomName)

      testClient.emit('start-game', roomName)
      testClient.on('*', (response) => {
        responses.push(response.data[1])

        if (responses.length > 4) {
          expect(responses[3]).toEqual(`Game has started in room ${roomName}`)
          expect(responses[4]).toEqual(['John Doe', 'Jane Doe'])
          done()
        }
      })
    })
  })
})
