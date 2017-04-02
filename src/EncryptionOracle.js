const AESUtils = require('./AESUtils')
const crypto = require('crypto')

class EncryptionOracle {

  /**
   * Encrypts data using ECB or CBC
   * with random key, random iv etc
   * pads data with 5-10 random bytes
   * @param {object} input 
   * @return {object} object containing data buffer and mode of encryption
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
      return {
        data: AESUtils.encryptCBC(data, randomKey, randomIV),
        mode: 'CBC'
      }
    } else {
      return {
        data: AESUtils.encryptECB(data, randomKey),
        mode: 'ECB'
      }
    }
  }

  /**
   * Detects encryption mode
   * @param {number} probes try hard
   * @return {number} success rate
   */
  detectEncryptionMode(probes) {
    let results = 0
    for (let j = 0; j < probes; j++) {
      let encrypted = this.encrypt(this._prepareInput())
      let guess = AESUtils.detectECBBuffer(encrypted.data) ? 'ECB' : 'CBC'
      if (guess === encrypted.mode) results += 1
    }
    return results/probes
  }

  _prepareInput() {
    let testData = 'test'
    for (let i = 0; i < 20; i++) {
      testData += 'test'
    }
    return testData
  }
}

module.exports = new EncryptionOracle()