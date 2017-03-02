const englishFreq = require('./english-alphabet-freq')
const xorUtils = require('./XorUtils')
const fs = require('fs')

class XorBreaker {
  breakSingleXorFile(fileName) {
    let data = fs.readFileSync(fileName, 'utf8')
    return data.split('\n')
        .map(line => Buffer.from(line, 'hex'))
        .map(buf => this.breakSingleXor(buf))
        .sort((a,b) => b[0]-a[0])[0]
  }

  /**
   * Breaks single character XOR on a buffer
   * based on frequency of letters in the english alphabet
   * @param {Buffer} dataBuffer buffer that holds xored data to recover
   * @return {[]} array containing [distance, key(single character), recovered string]
   */
  breakSingleXor(dataBuffer) {
    let result = [0, ''];
    for(let i=0; i<256; i++) {
      let char = Buffer.alloc(1).fill(i)
      let tryXor = xorUtils.xor(dataBuffer, char)
      let score = this.rateString(tryXor)
      if(result[0] < score) {
        result = [score, tryXor.toString('utf8')]
      }
    }
    return result
  }

  /**
   * Rate string based on ascii characters
   * @param {Buffer} dataBuffer buffer containing data
   * @return {number} score, higher = better
   */
  rateString(dataBuffer) {
    let score = 0
    dataBuffer.forEach(letter => {
      if((letter>=65 && letter<=90) || (letter>=97 && letter <=122) || letter===32) score+=3
      else if((letter>=33 && letter<=64) || (letter>=91 && letter<=96) || (letter>=123 && letter<=127)) score+=1
    })
    return score
  }
}

module.exports = new XorBreaker()