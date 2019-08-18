const _ = require('lodash')

const locations = require('../data/locations.json')
const roles = require('../data/roles.json')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomArrayIndex(max) {
  return getRandomInt(max - 1)
}

const getRandomLocation = (theme) => {
  const themedLocations = locations[theme]

  const numberOfLocations = locations[theme].length
  const randomIndexForLocation = getRandomArrayIndex(numberOfLocations)

  const location = themedLocations[randomIndexForLocation]

  return location
}

const getRandomRolesForLocation = (location, numberOfPlayers) => {
  const locationsRoles = roles[location]

  const shuffledRoles = _.shuffle(locationsRoles)
  const rolesForGameSize = shuffledRoles.splice(0, numberOfPlayers)

  const randomIndexForSpy = getRandomArrayIndex(numberOfPlayers)
  rolesForGameSize[randomIndexForSpy] = 'spy'

  return rolesForGameSize
}

module.exports = {
  getRandomLocation,
  getRandomRolesForLocation,
}
