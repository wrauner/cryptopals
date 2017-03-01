/**
 * Set one challenges
 * 1) function that converts hex 2 base64
 */
const SetOne = {
  /**
   * Converts hex to base64
   * @param {string} data hex encoded string
   * @return {string} data converted to base64 format
   */
  hex2base64: (data) => Buffer.from(data, 'hex').toString('base64'),

  xor: (a, b) => {
    let length = (a.length > b.length) ? b.length : a.length
    let result = Buffer.alloc(length)
    for(let i=0; i<length; i++) {
      result[i] = a[i] ^ b[i]
    }
    return result
  }
}

module.exports = SetOne