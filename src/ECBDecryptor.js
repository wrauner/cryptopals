const encryptionOracle = require('./EncryptionOracle')
const assert = require('assert')

class ECBDecryptor {

  /**
   * Breaks ECB encryption
   * modifies last byte of input string and probes encryption oracle
   * then matches the response with freshly build dictionary containing
   * all possible responses (to one byte modified)
   * @return {string} retrieved plaintext
   */
  breakECB() {
    let cipherBlocksize = this.findBlocksize()
    let outputBlocks = Math.ceil(encryptionOracle.encryptECB(Buffer.alloc(0)).length/cipherBlocksize)
    let detectionText = encryptionOracle.prepareInput()
    let retrievedPlaintext = ""
    if(encryptionOracle.detectEncryptionMode(detectionText) !== 'ECB') {
      throw new Error('Encryption is not ECB mode')
    }
    let bytesToBreak = outputBlocks*cipherBlocksize
    for(let bytesLeft = bytesToBreak; bytesLeft > 0; bytesLeft--) {
      let dictionary = this.createDictionary(retrievedPlaintext, bytesToBreak)
      let testVector = this._createTestVector(bytesLeft)
      let testOracleResponse = encryptionOracle.encryptECB(testVector).slice(0,bytesToBreak).toString('base64')
      assert(dictionary[testOracleResponse] !== undefined, 'answer must be in dictionary')
      retrievedPlaintext += dictionary[testOracleResponse]
    }
    return retrievedPlaintext
  }

  /**
   * Finds block size of cipher
   * @return {number} block size in bytes
   */
  findBlocksize() {
    let testString = 'A'
    let encryptedDataLength = encryptionOracle.encryptECB(testString).length
    let testLength = encryptedDataLength
    while(testLength === encryptedDataLength) {
      testString+='A'
      testLength = encryptionOracle.encryptECB(testString).length
    }
    return testLength - encryptedDataLength
  }

  /**
   * Creates dictionary containing
   * with values of strings with last byte changes (every possible value)
   * and encryption oracle responses as keys
   * @param {string} retrievedPlaintext already retrieved plaintext
   * @param {number} bytesToBreak how many bytes we will break
   * @return {object} dictionary
   */
  createDictionary(retrievedPlaintext, bytesToBreak) {
    let dictionary = {}
    let testBuffer = Buffer.concat([Buffer.alloc(bytesToBreak-retrievedPlaintext.length-1).fill('A'), Buffer.from(retrievedPlaintext), Buffer.from('A')])
    for(let i=0; i<255; i++) {
      testBuffer[testBuffer.length-1] = i
      let oracleResponse = encryptionOracle.encryptECB(testBuffer).slice(0, bytesToBreak).toString('base64')
      dictionary[oracleResponse] = String.fromCharCode(i)
    }
    return dictionary
  }

  /**
   * Provides vector to test encryption oracle
   * @param {number} bytesLeft bytes left to break
   * @return {Buffer} buffer containing bytesLeft-1 bytes
   */
  _createTestVector(bytesLeft) {
    return Buffer.alloc(bytesLeft-1).fill('A')
  }
}

module.exports = new ECBDecryptor()
