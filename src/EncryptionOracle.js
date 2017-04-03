const AESUtils = require('./AESUtils')
const crypto = require('crypto')

class EncryptionOracle {

  constructor() {
    this._ecbKey = crypto.randomBytes(16) //usage in challenge 12
    this._prefix = Buffer.from(`Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkg
    aGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBq
    dXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUg
    YnkK`, 'base64')
  }

  /**
   * Encrypts data using ECB or CBC
   * with random key, random iv etc
   * pads data with 5-10 random bytes
   * @param {object} input 
   * @return {Buffer} encrypted data
   */
  encrypt(input) {
    if (!Buffer.isBuffer(input)) {
      input = Buffer.from(input)
    }
    let randomKey = crypto.randomBytes(16)
    let isCBC = Math.random() > 0.5
    let padLength = Math.floor(Math.random() * 5) + 5;
    let randomPad = crypto.randomBytes(padLength)
    let data = Buffer.concat([randomPad, input, randomPad])
    if (isCBC) {
      let randomIV = crypto.randomBytes(16)
      return AESUtils.encryptCBC(data, randomKey, randomIV)
    } else {
      return AESUtils.encryptECB(data, randomKey)
    }
  }

  /**
   * Encrypts data using AES-ECB with constant
   * key, generated randomly during class initialization
   * appends prefix string before encrypting
   * @param {Buffer} data to encrypt
   * @return {Buffer} encrypted data
   */
  encryptECB(data) {
    if(!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    return AESUtils.encryptECB(Buffer.concat([data, this._prefix]), this._ecbKey)
  }

  /**
   * Detects encryption mode
   * @return {number} success rate
   */
  detectEncryptionMode(encryptedData) {
    return AESUtils.detectECBBuffer(encryptedData) ? 'ECB' : 'CBC'
  }

  prepareInput() {
    let testData = 'test'
    for (let i = 0; i < 20; i++) {
      testData += 'test'
    }
    return testData
  }
}

module.exports = new EncryptionOracle()