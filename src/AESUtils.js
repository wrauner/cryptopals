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

  /**
   * Detects AES ECB line in encrypted file
   * @param {string} fileName fileName
   * @return {number} number of line that is encrypted with AES ECB
   */
  detectAESFile(fileName) {
    let data = fs.readFileSync(fileName, 'utf8')
    let rows = data.split('\n')
    let index = -1;
    for(let i=0, len=rows.length; i<len; i++) {
      if(this.detectAESRow(rows[i])) index = i;
    }
    return index;
  }

  /**
   * Detects AES ECB in single line of text
   * @param {string} row posisbly encrypted string
   * @return {boolean} if the line is AES ECB enc or not
   */
  detectAESRow(row) {
    let rowLength = row.length
    for(let j=0, len=rowLength/16-1; j<len; j++) {
      let start = j*16;
      let firstBytes = row.slice(start,start+16)
      let remainBytes = row.slice(start+16, rowLength)
      if(remainBytes.indexOf(firstBytes) !== -1) return true
    }
    return false
  }
}

module.exports = new AESUtils()