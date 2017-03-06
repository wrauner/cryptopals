const expect = require('chai').expect
const pkcsUtils = require('../set-two/PkcsUtils')
const mlog = require('mocha-logger')

describe('Set 2, Block crypto', () => {
  describe('Challenge 9, Implement PKCS#7 padding', () => {
    it('Should implement pkcs#7 padding', () => {
      let testData = 'YELLOW SUBMARINE'
      let result = 'YELLOW SUBMARINE\u0004\u0004\u0004\u0004'

      let paddedData = pkcsUtils.pad(testData, 20)
      expect(paddedData).to.equal(result)
    })
  })
})