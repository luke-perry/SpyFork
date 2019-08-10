const locations = require('../data/locations.json')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const getRandomLocation = (theme) => {
    const themedLocations = locations[theme]

    const numberOfLocations = locations[theme].length
    const randomIndexForLocation = getRandomInt(numberOfLocations-1)

    const location = themedLocations[randomIndexForLocation]

    return location
}

module.exports = {
    getRandomLocation,
}
