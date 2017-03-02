const englishFreq = require('./english-alphabet-freq')
const xorUtils = require('./XorUtils')

class XorBreaker {
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
      if(tryXor.every(letter => letter>31 && letter<127)) { //as a result we want a text
        let frequency = this.calculateFrequency(tryXor)
        let distance = this.calculateFreqDistance(frequency)
        result.push([distance, char.toString('utf8'), tryXor.toString('utf8')])
      }
    }
    return result.sort((a, b) => a[0]-b[0])
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