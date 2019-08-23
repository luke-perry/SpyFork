function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomArrayIndex(max) {
  if (max < 0) {
    throw new Error(RangeError)
  }

  return Math.abs(getRandomInt(max - 1))
}

module.exports = {
  getRandomInt,
  getRandomArrayIndex,
}
