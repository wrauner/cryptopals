const expect = require('chai').expect
const setOneModule = require('./set-one')

describe('Set one challenges', () => {
  describe('Set one module', () => {
    it('converts hex to base64', () => {
      let test = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d'
      let result = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t'

      let convertedResult = setOneModule.hex2base64(test)
      expect(convertedResult).to.equal(result)
    })
    it('xors two strings', () => {
      let test = Buffer.from('1c0111001f010100061a024b53535009181c', 'hex')
      let key = Buffer.from('686974207468652062756c6c277320657965', 'hex')
      let result = Buffer.from('746865206b696420646f6e277420706c6179', 'hex')

      let xoredResult = setOneModule.xor(test, key)
      expect(result).to.deep.equal(xoredResult)
    })
  })
})