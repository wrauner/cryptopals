class PkcsUtils {
  /**
   * Padds data to required length
   * using pkcs#7 scheme
   * @param {Buffer} data buffer containing data to pad
   * @param {number} requiredLength required length to pad
   * @return {Buffer} padded buffer
   */
  pad(data, requiredLength) {
    if (requiredLength > data.length) {
      return Buffer.concat([data, Buffer.alloc(requiredLength - data.length).fill(4)])
    } else {
      return data
    }
  }

  padString(data, requiredLength) {
    return this.pad(Buffer.from(data), requiredLength).toString('utf8')
  }

  trim(dataBuffer) {
    var firstFour = 0;
    for (let i = dataBuffer.length - 1; i >= 0; i--) {
      if (dataBuffer[i] !== 0x04) {
        firstFour = i;
        break;
      }
    }
    return dataBuffer.slice(0, firstFour + 1);
  }

  trimString(data) {
    return this.trim(Buffer.from(data)).toString('utf8')
  }
}

module.exports = new PkcsUtils()