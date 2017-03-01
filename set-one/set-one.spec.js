const expect = require('chai').expect
const setOneModule = require('./set-one')

describe('Set one challenges', () => {
  describe('Set one module', () => {
    it('it converts hex to base64', () => {
      let test = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d'
      let result = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t'

      let convertedResult = setOneModule.hex2base64(test)
      expect(convertedResult).to.equal(result);
    })
  })
})