const englishFreq = require('./english-alphabet-freq')
const xorUtils = require('./XorUtils')
const fs = require('fs')
const franc = require('franc')

class XorBreaker {
  breakSingleXorFile(fileName) {
    let data = fs.readFileSync(fileName, 'utf8')
    return data.split('\n')
        .map(line => Buffer.from(line, 'hex'))
        .map(buf => this.breakSingleXor(buf))
        .reduce((a,b) => a.concat(b), [])
  }

  /**
   * Breaks single character XOR on a buffer
   * based on frequency of letters in the english alphabet
   * @param {Buffer} dataBuffer buffer that holds xored data to recover
   * @return {[]} array containing [distance, key(single character), recovered string]
   */
  breakSingleXor(dataBuffer) {
    let result = [];
    for(let i=0; i<256; i++) {
      let char = Buffer.alloc(1).fill(i)
      let tryXor = xorUtils.xor(dataBuffer, char)
      if(tryXor.every(letter => letter>31 && letter<127) && franc(tryXor.toString('utf8')) === 'eng') {
        result.push(tryXor.toString('utf8'))
      }
    }
    return result;
  }

  /**
   * Calculates frequency of letters in string
   * @param {Buffer} xoredBuffer buffer with data to calculate freq
   * @return {object} object that contains uppercase letters as keys and frequency as params
   */
  calculateFrequency(xoredBuffer) {
    let frequency = this.prepareEmptyFreq()
    xoredBuffer.toString('utf8').toUpperCase().split('').forEach(letter => {
      if(frequency[letter] !== undefined) {
        frequency[letter] += 1/xoredBuffer.length
      }
    })
    return frequency
  }

  /**
   * Calculates euclidian distance
   * of object, that contains frequency of letters in string
   * from english alphabet frequency
   * @param {object} frequency object that contains frequency of letters in a string
   * @return {number} euclidian distance
   */
  calculateFreqDistance(frequency) {
    let sum = 0;
    for(let letter in frequency) {
      sum += Math.pow(frequency[letter]-englishFreq[letter], 2)
    }
    return Math.sqrt(sum)
  }

  prepareEmptyFreq() {
    let result = {};
    for(let key in englishFreq) {
      result[key] = 0
    }
    return result
  }
}

module.exports = new XorBreaker()