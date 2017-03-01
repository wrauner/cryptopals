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
  hex2base64: (data) => Buffer.from(data, 'hex').toString('base64')
}

module.exports = SetOne