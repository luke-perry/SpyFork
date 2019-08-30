/* eslint-disable global-require */
const ioClient = require('socket.io-client')
const server = require('../App')

describe('socketEvents', () => {
  let serverDetails
  let testClient

  beforeAll(async (done) => {
    serverDetails = server.httpServer.address()

    testClient = ioClient(`http://localhost:${serverDetails.port}/`)
    const patch = require('socketio-wildcard')(ioClient.Manager)
    patch(testClient)

    testClient.on('connect', () => { done() })
  })

  afterAll((done) => {
    server.httpServer.close()
    if (testClient.connected) testClient.disconnect()
    done()
  })

  describe('create-game', () => {
    it('should emit events that the room is created, hosted, and its roster', async (done) => {
      let responseCount = 0
      const responses = []


      testClient.emit('create-game', 'John Doe', 'boring')
      testClient.on('*', (response) => {
        responses.push(response.data)
        responseCount += 1

        if (responseCount > 3) {
          expect(responses[1][1]).toEqual(expect.stringMatching(/John Doe has joined \S+-\S+ as host/))
          expect(responses[2][1]).toEqual(expect.stringMatching(/\S+-\S+ Room created/))
          expect(responses[3][1]).toEqual(['John Doe'])
          done()
        }
      })
    })
  })
})
