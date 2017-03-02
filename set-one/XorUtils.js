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
    for(let i=0; i<length; i++) {
      result[i] = a[i] ^ b[i % b.length]
    }
    return result
  }
}

module.exports = new XorUtils()