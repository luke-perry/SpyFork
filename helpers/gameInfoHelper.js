const _ = require('lodash')

const mathUtility = require('../utilities/mathUtility')
const locations = require('../data/locations.json')
const roles = require('../data/roles.json')

const insertSpyAtRandomLocation = (trimmedRoles) => {
  const randomIndexForSpy = mathUtility.getRandomArrayIndex(trimmedRoles.length - 1)

  const spyInsertedRoles = trimmedRoles
  spyInsertedRoles[randomIndexForSpy] = 'spy'

  return spyInsertedRoles
}

const getRandomLocation = (theme) => {
  const themedLocations = locations[theme]

  const numberOfLocations = locations[theme].length
  const randomIndexForLocation = mathUtility.getRandomArrayIndex(numberOfLocations)

  const location = themedLocations[randomIndexForLocation]

  return location
}

const getRandomRolesForLocation = (location, numberOfPlayers) => {
  const locationsRoles = roles[location]

  const shuffledRoles = _.shuffle(locationsRoles)
  const rolesForGameSize = shuffledRoles.splice(0, numberOfPlayers)

  return insertSpyAtRandomLocation(rolesForGameSize)
}

module.exports = {
  getRandomLocation,
  getRandomRolesForLocation,
}
