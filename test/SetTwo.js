const expect = require('chai').expect
const pkcsUtils = require('../src/PkcsUtils')
const aesUtils = require('../src/AESUtils')
const encryptionOracle = require('../src/EncryptionOracle')
const ecbDecryptor = require('../src/ECBDecryptor')
const profileCookieGenerator = require('../src/ProfileCookieGenerator')
const profileCookieSpoofer = require('../src/ProfileCookieSpoofer')
const mlog = require('mocha-logger')
const fs = require('fs')

describe('Set 2, Block crypto', () => {
  describe('Challenge 9, Implement PKCS#7 padding', () => {
    it('Should implement pkcs#7 padding', () => {
      let testData = 'YELLOW SUBMARINE'
      let result = 'YELLOW SUBMARINE\u0004\u0004\u0004\u0004'

      let paddedData = pkcsUtils.padString(testData, 20)
      expect(paddedData).to.equal(result)
    })
  })
  describe('Challenge 10, Implement CBC mode', () => {
    it('Should implement AES-CBC mode', () => {
      let testData = Buffer.from('Im back')
      let testiv = Buffer.from('YELLOW SUBMARINE')
      let testKey = 'YELLOW SUBMARINE'

      let encrypted = aesUtils.encryptCBC(testData, testKey, testiv)
      let decrypted = pkcsUtils.trim(aesUtils.decryptCBC(encrypted, testKey, testiv))

      expect(decrypted).to.deep.equal(testData)
    })
    it('Should decrypt provided data', () => {
      let testKey = 'YELLOW SUBMARINE'
      let testiv = Buffer.alloc(16).fill(0)
      let filename = './data/10.txt'

      let decrypted = aesUtils.decryptFileCBC(filename, testKey, testiv).toString()
      mlog.log(`First 30 chars of decrypted text: ${decrypted.slice(0, 30)}`)
      expect(decrypted.startsWith("I'm back and I'm ringin' the bell")).to.be.true
    })
  })
  describe('Challenge 11, An ECB/CBC detection oracle', () => {
    it('should detect cipher mode of operation', () => {
      let testData = encryptionOracle.prepareInput()
      let encryptedData = encryptionOracle.encrypt(testData)
      let guess = encryptionOracle.detectEncryptionMode(encryptedData)
      mlog.log(`Detected encryption mode: ${guess}`)
    })
  })
  describe('Challenge 12, Byte-at-a-time ECB decryption', () => {
    it('should encrypt correctly', () => {
      let encryptedData = encryptionOracle.encryptECB('test')
      expect(encryptedData).not.to.deep.equal(Buffer.alloc(0))
    })
    it('should detect cipher block size', () => {
      let cipherBlocksize = ecbDecryptor.findBlocksize()
      expect(cipherBlocksize).to.equal(16)
    })
    it('should break ECB', () => {
      let plaintext = ecbDecryptor.breakECB()
      mlog.log(plaintext)
      expect(plaintext).to.not.be.empty
    })
  })
  describe('Challenge 13, ECB cut-and-paste', () => {
    it('should convert url to json', () => {
      let testData = 'foo=bar&baz=qux&zap=zazzle'
      let result = profileCookieGenerator.urlParams2JSON(testData)
      expect(result).to.has.property('foo', 'bar')
      expect(result).to.has.property('baz', 'qux')
      expect(result).to.has.property('zap', 'zazzle')
    })
    it('should convert json to url params', () => {
      let testData = {
        email: 'foo@bar.com',
        uid: 10,
        role: 'user'
      }
      let result = profileCookieGenerator.json2urlParams(testData)
      expect(result).to.equal('email=foo@bar.com&uid=10&role=user')
    })
    it('should encrypt cookie', () => {
      let result = profileCookieGenerator.profileFor('test@test.pl')
      expect(result).to.not.be.empty;
      let decryptedResult = profileCookieGenerator.parseProfile(result)
      expect(decryptedResult).to.have.property('email', 'test@test.pl')
    })
    it('should probe for block size and test vector size', () => {
      let probe = profileCookieSpoofer.probeCookieGenerator()
      expect(probe.blockSize).to.equal(16)
    })
    it('should produce fake profile cookie', ()=> {
      let fakeCookie = profileCookieSpoofer.produceAdminCookie()
      let parsedFakeCookie = profileCookieGenerator.parseProfile(fakeCookie)
      expect(parsedFakeCookie).to.have.property('role', 'admin')
    })
  })
})