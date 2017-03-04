const crypto = require('crypto')
const fs = require('fs')

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
    //crypto.createDecipher won't work
    //only createDecipheriv with EMPTY iv
    //why? not sure
    let decrypt = crypto.createDecipheriv('aes-128-ecb', pass, Buffer.alloc(0))
    let decrypted = Buffer.concat([decrypt.update(dataBuffer), decrypt.final()])
    return decrypted.toString('utf8')
  }
}

module.exports = new AESUtils()