const englishFreq = require('./english-alphabet-freq')
const xorUtils = require('./XorUtils')
const fs = require('fs')

class XorBreaker {
  /**
   * Detecting single-char xor in fileData
   * @param {string} fileName - name of the file
   * @return {string} probably the correct plaintext
   */
  detectSingleXor(fileName) {
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
        result = [score, tryXor.toString('utf8'), char[0]]
      }
    }
    return result
  }

  /**
   * Breaking repeating xor in file
   * firstly it tries to guess correct keysize using
   * Kasiski examination, then transposes the buffer
   * and bruteForces single character xor
   * @param {string} fileName name of file containing encrypted data
   * @return {string} decrypted data
   */
  breakRepeatingXor(fileName) {
    let fileData = fs.readFileSync(fileName, 'utf8').replace('\n', '')
    let data = Buffer.from(fileData, 'base64')
    let result = []
    this.findDistances(data).forEach(distanceData => {
      let key = []
      let keySize = distanceData[0]
      let transposed = this.transposeBuffer(data, keySize)
      transposed.forEach(singleXor => {
        key.push(this.breakSingleXor(singleXor)[2])
      })
      let strKey = Buffer.from(key)
      let plainText = xorUtils.xor(data, strKey)
      result.push({key: strKey.toString(), plaintext: plainText.toString(), rating: this.rateString(plainText)});
    })
    return result.sort((a,b) => b.rating - a.rating)[0]
  }

  /**
   * Transposes buffer
   * generates vectorN of buffers
   * @param {Buffer} buffer buffer to transpose
   * @return {Buffer[]} array of buffers
   */
  transposeBuffer(buffer, vectorN) {
    let result = []
    buffer.map((byte, byteIndex) => {
      let index = byteIndex % vectorN
      if(result[index] === undefined) {
        result[index] = [byte]
      } else {
        result[index].push(byte)
      }
    })
    return result.map(row => Buffer.from(row))
  }

  /**
   * Finding hamming distances
   * shortest one should be the keylength of repeating xor cipher
   * this is based on Kasiski examination
   * @param {Buffer} dataBuffer buffer containing encrypted data
   * @return {[]} array of distance data for each keysize
   */
  findDistances(dataBuffer) {
    let result = []
    for(let keysize = 2; keysize<=40; keysize++) {
      let distance = 0;
      for(let i=0; i<4; i++) {
        let firstSlice = dataBuffer.slice(i*keysize, i*keysize+keysize)
        let secondSlice = dataBuffer.slice(i*keysize+keysize, i*keysize+2*keysize)
        distance += xorUtils.distance(firstSlice, secondSlice)
      }
      distance = distance/4
      result.push([keysize, distance/keysize])
    }
    return result.sort((a,b) => a[1]-b[1]).slice(0, 3)
  }

  /**
   * Rate string based on ascii characters
   * @param {Buffer} dataBuffer buffer containing data
   * @return {number} score, higher = better
   */
  rateString(dataBuffer) {
    let score = 0
    dataBuffer.forEach(letter => {
      if((letter>=65 && letter<=90) || (letter>=97 && letter <=122) || letter===92) score+=20 //pay for alphabet chars
      else if (letter===32) score+=100 //we pay extra for spaces
      else if((letter>=33 && letter<=64) || (letter>=93 && letter<=96) || (letter>=123 && letter<=127) || letter === 91) score+=10
      else score-=100;
    })
    return score
  }
}

module.exports = new XorBreaker()