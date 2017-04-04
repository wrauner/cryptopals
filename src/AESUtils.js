const crypto = require('crypto')
const fs = require('fs')
const xorUtils = require('./XorUtils')
const pkcsUtils = require('./PkcsUtils')
const assert = require('assert')

class AESUtils {
  /**
   * Decrypts file using AES-128-ECB
   * @param {string} fileName fileName
   * @param {string} pass password
   * @return {string} decrypted data
   */
  decryptFileECB(fileName, pass) {
    let data = fs.readFileSync(fileName, 'utf8').replace('\n', '')
    let dataBuffer = Buffer.from(data, 'base64')
    return this.decryptECB(dataBuffer, pass)
  }

  /**
   * Detects AES ECB line in encrypted file
   * @param {string} fileName fileName
   * @return {number} number of line that is encrypted with AES ECB
   */
  detectECBFile(fileName) {
    let data = fs.readFileSync(fileName, 'utf8')
    let rows = data.split('\n')
    let index = -1;
    for(let i=0, len=rows.length; i<len; i++) {
      if(this._detectECBRow(rows[i])) index = i;
    }
    return index;
  }

  detectECBBuffer(input) {
    return this._detectECBRow(input)
  }

  /**
   * Detects AES ECB in single line of text
   * @param {string} row posisbly encrypted string
   * @return {boolean} if the line is AES ECB enc or not
   */
  _detectECBRow(row) {
    let rowLength = row.length
    for(let j=0, len=rowLength/16-1; j<len; j++) {
      let start = j*16;
      let firstBytes = row.slice(start,start+16)
      let remainBytes = row.slice(start+16, rowLength)
      if(remainBytes.indexOf(firstBytes) !== -1) return true
    }
    return false
  }

  /**
   * Encrypt using AES-128 in CBC mode
   * data padded with pkcs#7
   * @param {Buffer} data data to encrypt
   * @param {string} key key to use
   * @param {Buffer} iv initialization vector
   * @return {Buffer} encrypted data
   */
  encryptCBC(data, key, iv) {
    assert(iv.length === 16, 'IV must be 16 bytes')
    let chunkedData = this._chunkData(data, 16)
    let encryptedData = []
    let previousChunk = null
    for(let i=0, len = chunkedData.length; i<len; i++) {
      let combinedData = xorUtils.xor(chunkedData[i], (i===0) ? iv : previousChunk)
      let encryptedBlock = this._encryptBlockAES(combinedData, key)
      encryptedData.push(encryptedBlock)
      previousChunk = encryptedBlock
    }
    return Buffer.concat(encryptedData)
  }

  encryptECB(data, key) {
    if(!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    let chunkedData = this._chunkData(data, 16)
    let encryptedData = []
    for(let i=0, len = chunkedData.length; i<len; i++) {
      encryptedData.push(this._encryptBlockAES(chunkedData[i], key))
    }
    return Buffer.concat(encryptedData)
  }

  decryptECB(data, key) {
    if(!Buffer.isBuffer(key)) {
      key = Buffer.from(key)
    }
    let decrypt = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0))
    decrypt.setAutoPadding(false)
    let decrypted = Buffer.concat([decrypt.update(data), decrypt.final()])
    return decrypted.toString('utf8')
  }

  /**
   * Decrypt file using AES-128 in CBC mode
   * @param {string} filename filename
   * @param {string} key key to use
   * @param {Buffer} iv initialization vector
   * @return {Buffer} decrypted data
   */
  decryptFileCBC(filename, key, iv) {
    let data = fs.readFileSync(filename, 'utf8').replace('\n', '')
    let dataBuffer = Buffer.from(data, 'base64')
    return this.decryptCBC(dataBuffer, key, iv)
  }

  /**
   * AES-128 CBC mode decryption
   * @param {Buffer} data data to decrypt
   * @param {string} key key to use
   * @param {Buffer} iv initialization vector
   * @return {Buffer} decrypted data
   */
  decryptCBC(data, key, iv) {
    assert(iv.length === 16, 'IV must be 16 bytes')
    let chunkedData = this._chunkData(data, 16)
    let decryptedData = []
    for(let i=0, len = chunkedData.length; i<len; i++) {
      let decryptedBlock = this._decryptBlockAES(chunkedData[i], key)
      let readyBlock = xorUtils.xor(decryptedBlock, (i===0) ? iv : chunkedData[i-1])
      decryptedData.push(readyBlock)
    }
    return Buffer.concat(decryptedData)
  }

  /**
   * Splits array into chunks,
   * applies pkcs#7 padding
   * @param {Array} data array to split
   * @param {number} chunkSize size of each chunk
   * @return {Array} array splitted and padded
   */
  _chunkData(data, chunkSize) {
    var R = [];
    for (var i=0; i<data.length; i+=chunkSize)
        R.push(pkcsUtils.pad(data.slice(i,i+chunkSize), chunkSize));
    return R;
  }

  /**
   * AES-128 encryption
   * @param {Buffer} block data to encrypt
   * @param {string} key key to encrypt
   * @return {Buffer} encrypted data
   */
  _encryptBlockAES(block, key) {
    let cipher = crypto.createCipheriv('aes-128-ecb', key, Buffer.alloc(0))
    cipher.setAutoPadding(false)
    return Buffer.concat([cipher.update(block), cipher.final()])
  }

  /**
   * AES-128 decryption
   * @param {Buffer} block data to decrypt
   * @param {string} key key to decrypt
   * @return {Buffer} decrypted data
   */
  _decryptBlockAES(block, key) {
    //crypto.createDecipher won't work
    //only createDecipheriv with EMPTY iv
    //why? not sure
    let decipher = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0))
    decipher.setAutoPadding(false)
    return Buffer.concat([decipher.update(block), decipher.final()])
  }
}

module.exports = new AESUtils()