const mathUtility = require('../mathUtility')

describe('mathUtility', () => {
  describe('getRandomInt', () => {
    it('should return the floor of the random number generated * the max', () => {
      const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5)
      const mockMathFloor = jest.spyOn(Math, 'floor')
      const expectedResult = 2

      const result = mathUtility.getRandomInt(4)

      expect(mockMathRandom).toHaveBeenCalled()
      expect(mockMathFloor).toHaveBeenCalledTimes(2)
      expect(result).toEqual(expectedResult)
    })

    it('should hanlde a negative number by return a negative value', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5)

      const result = mathUtility.getRandomInt(-4)

      expect(result).toEqual(-2)
    })
  })

  describe('getRandomArrayIndex', () => {
    it('should return the result of the getRandomInt value minus 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5)
      const expectedResult = 1

      const result = mathUtility.getRandomArrayIndex(4)
      expect(result).toEqual(expectedResult)
    })

    it('should not return a negative index if the provided max is zero', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.0)
      const expectedResult = 0

      const result = mathUtility.getRandomArrayIndex(0)
      expect(result).toEqual(expectedResult)
    })

    it('should throw an error if a negative max is provided', () => {
      expect(() => {
        mathUtility.getRandomArrayIndex(-1)
      }).toThrow()
    })
  })
})
