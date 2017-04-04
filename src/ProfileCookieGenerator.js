const aesUtils = require('../src/AESUtils')
const crypto = require('crypto')

class ProfileCookieGenerator {
  constructor() {
    this._randomKey = crypto.randomBytes(16)
  }

  urlParams2JSON(params) {
    return params.split('&').reduce((a, b) => {
      let kv = b.split('=')
      a[kv[0]] = kv[1]
      return a
    }, {})
  }

  json2urlParams(obj) {
    return Object.keys(obj).reduce((prev, key) => {
      return prev += `${this.replaceChars(key)}=${this.replaceChars(obj[key].toString())}&`
    }, '').slice(0, -1)
  }

  replaceChars(str) {
    return str.replace('&', '020').replace('=', '040')
  }

  profileFor(email) {
    let cookie = {
      email: email,
      uid: 10,
      role: 'user'
    }
    return aesUtils.encryptECB(this.json2urlParams(cookie), this._randomKey)
  }

  parseProfile(profile) {
    let decrypted = aesUtils.decryptECB(profile, this._randomKey)
    return this.urlParams2JSON(decrypted)
  }
}

module.exports = new ProfileCookieGenerator()