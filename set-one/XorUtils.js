class XorUtils {
  /**
   * Converts hex to base64
   * @param {string} data hex encoded string
   * @return {string} data converted to base64 format
   */
  hex2base64(data) {
    return Buffer.from(data, 'hex').toString('base64')
  }

  /**
   * Xors two buffers
   * @param {Buffer} a first buffer
   * @param {Buffer} b second buffer, if shorter then its applied on whole length of a buf
   * @return {Buffer} xored buffers
   */
  xor(a, b) {
    let length = a.length
    let result = Buffer.alloc(length)
    for (let i = 0; i < length; i++) {
      result[i] = a[i] ^ b[i % b.length]
    }
    return result
  }

  /**
   * Calculates Hamming distance of two buffers
   * @param {Buffer} a first buffer
   * @param {Buffer} b second buffer
   * @return {Buffer} hamming distance
   */
  distance(a, b) {
    let result = 0;
    for (let i = 0, length = a.length; i < length; i++) {
      let n = a[i] ^ b[i]
      let count = 0
      while (n != 0) {
        n &= (n - 1)
        count++
      }
      result+=count
    }
    return result
  }
}

module.exports = new XorUtils()