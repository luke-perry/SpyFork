const _ = require('lodash')

const gameInfoHelper = require('../gameInfoHelper')
const mathUtility = require('../../utilities/mathUtility')

const locations = require('../../data/locations')
const roles = require('../../data/roles')

describe('gameInfoHelper', () => {
  describe('#getRandomLocation', () => {
    it('should use the random index generator to return a location at the generated index', () => {
      const fakeRandomIndex = 1
      const sampleTheme = 'boring'
      const expectedLocation = locations[sampleTheme][fakeRandomIndex]

      jest.spyOn(mathUtility, 'getRandomArrayIndex').mockReturnValue(fakeRandomIndex)

      const result = gameInfoHelper.getRandomLocation(sampleTheme)

      expect(result).toEqual(expectedLocation)
    })
  })

  describe('getRandomRolesForLocations', () => {
    it('should return a sized array of location\'s roles for the nubmer of players', () => {
      const sampleNumberOfPlayers = 3
      const sampleLocation = 'library'
      const result = gameInfoHelper.getRandomRolesForLocation(sampleLocation, sampleNumberOfPlayers)

      expect(result.length).toBe(sampleNumberOfPlayers)
    })

    it('should contain only roles from the specified location', () => {
      const sampleNumberOfPlayers = 3
      const sampleLocation = 'library'

      const locationRoles = roles[sampleLocation]

      const result = gameInfoHelper.getRandomRolesForLocation(sampleLocation, sampleNumberOfPlayers)

      result.filter((role) => role !== 'spy').forEach((role) => {
        expect(locationRoles).toContain(role)
      })
    })

    it('should include the spy at a random location', () => {
      const fakeRandomIndex = 1
      jest.spyOn(mathUtility, 'getRandomArrayIndex').mockReturnValue(fakeRandomIndex)

      const result = gameInfoHelper.getRandomRolesForLocation('library', 3)

      expect(result[fakeRandomIndex]).toEqual('spy')
    })

    it('should randomize the trimmed roles of the location', () => {
      const sampleNumberOfGamePlayers = 3
      const sampleLocation = 'library'
      const locationRoles = roles[sampleLocation]
      const reorderedLocationRoles = locationRoles

      jest.spyOn(mathUtility, 'getRandomArrayIndex').mockReturnValue(sampleNumberOfGamePlayers - 1)
      const shuffleSpy = jest.spyOn(_, 'shuffle').mockReturnValue(_.cloneDeep(reorderedLocationRoles))

      const result = gameInfoHelper.getRandomRolesForLocation(sampleLocation, sampleNumberOfGamePlayers)

      expect(shuffleSpy).toHaveBeenCalledWith(locationRoles)
      result.filter((role) => role !== 'spy').forEach((role, idx) => {
        expect(role).toEqual(reorderedLocationRoles[idx])
      })
    })
  })
})
