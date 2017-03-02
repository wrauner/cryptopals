const expect = require('chai').expect
const mlog = require('mocha-logger')
const xorUtils = require('./XorUtils')
const xorBreaker = require('./XorBreaker')

describe('Set 1, Basic', () => {
  describe('Challenge 1, Convert hex to base64', () => {
    it('converts hex to base64', () => {
      let test = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d'
      let result = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t'

      let convertedResult = xorUtils.hex2base64(test)
      expect(convertedResult).to.equal(result)
    })
  })
  describe('Challenge 2, Fixed XOR', () => {
    it('xors two strings', () => {
      let test = Buffer.from('1c0111001f010100061a024b53535009181c', 'hex')
      let key = Buffer.from('686974207468652062756c6c277320657965', 'hex')
      let result = Buffer.from('746865206b696420646f6e277420706c6179', 'hex')

      let xoredResult = xorUtils.xor(test, key)
      expect(result).to.deep.equal(xoredResult)
    })
    it('xors two strings, even if b is short key', () => {
      let test = Buffer.from('0202', 'hex')
      let key = Buffer.from('01', 'hex')
      let result = Buffer.from('0303', 'hex')

      let xoredResult = xorUtils.xor(test, key)
      expect(result).to.deep.equal(xoredResult)
    })
  })
  describe('Challenge 3, Breaking XOR', () => {
    it('breaks single xor', () => {
      let test = Buffer.from('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', 'hex')
      let result = xorBreaker.breakSingleXor(test)
      mlog.log(JSON.stringify(result[1], undefined, 2))
      expect(result[1]).to.equal("Cooking MC's like a pound of bacon")
    })
  })
  describe('Challenge 4, Detect single-character XOR', () => {
    it('detects and breaks single xor', () => {
      let result = xorBreaker.breakSingleXorFile('./set-one/data/4.txt')
      mlog.log(JSON.stringify(result[1], undefined, 2))
      expect(result[1]).to.equal("Now that the party is jumping\n")
    })
  })
  describe('Challenge 5, Implement repeating-key XOR', () => {
    it('Xors repeating key', () => {
      let verse_one = Buffer.from("Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal")
      let result = "0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f"
      let xor_one = xorUtils.xor(verse_one, Buffer.from('ICE')).toString('hex')
      expect(xor_one).to.equal(result)
    })
  })
})