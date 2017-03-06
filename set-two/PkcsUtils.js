class PkcsUtils {
  /**
   * Padds data to required length
   * using pkcs#7 scheme
   * @param {string} data string containing data to pad
   * @param {number} requiredLength required length to pad
   * @return {string} padded string
   */
  pad(data, requiredLength) {
    return Buffer.concat([Buffer.from(data), Buffer.alloc(requiredLength-data.length).fill(4)]).toString('utf8')
  }
}

module.exports = new PkcsUtils()