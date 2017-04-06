const aesUtils = require('../src/AESUtils')
const crypto = require('crypto')

class ProfileCookieGenerator {
  constructor() {
    this._randomKey = crypto.randomBytes(16) //used to encrypt cookie
  }

  /**
   * Converts url params 2 json
   * @param {string} params object encoded as url params
   * @return {object} parsed object
   */
  urlParams2JSON(params) {
    return params.split('&').reduce((a, b) => {
      let kv = b.split('=')
      a[kv[0]] = kv[1]
      return a
    }, {})
  }

  /**
   * Converts object to url encoded string
   * @param {object} obj object to convert
   * @return {string} object converted to url encoded string
   */
  json2urlParams(obj) {
    return Object.keys(obj).reduce((prev, key) => {
      return prev += `${this.replaceChars(key)}=${this.replaceChars(obj[key].toString())}&`
    }, '').slice(0, -1)
  }

  /**
   * Replaces special characters & and = in objects
   * @param {string} str string to replace data in
   * @return {string} safe string
   */
  replaceChars(str) {
    return str.replace('&', '020').replace('=', '040')
  }

  /**
   * Creates encrypted cookie for email
   * @param {string} email 
   * @return {string} cookie
   */
  profileFor(email) {
    let cookie = {
      email: email,
      uid: 10,
      role: 'user'
    }
    return aesUtils.encryptECB(this.json2urlParams(cookie), this._randomKey)
  }

  /**
   * Prases encrypted cookie
   * revealing its data
   * @param {string} profile encrypted cookie
   * @return decrypted cookie
   */
  parseProfile(profile) {
    let decrypted = aesUtils.decryptECB(profile, this._randomKey)
    return this.urlParams2JSON(decrypted)
  }
}

module.exports = new ProfileCookieGenerator()