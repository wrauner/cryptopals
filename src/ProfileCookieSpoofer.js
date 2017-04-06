const profileCookieGenerator = require('./ProfileCookieGenerator')


/**
 * This class produces a fake admin cookie for profileCookieGenerator
 * Firstly it encrypts block with admin+padding, remembers it
 * then it uses fixed length email address to receive a clean cut at role part
 * then combines first part of valid cookie with fake admin block
 */
class ProfileCookieSpoofer {

  /**
   * Produces fake admin cookie
   */
  produceAdminCookie() {
    let probe = this.probeCookieGenerator()
    return this.produceFakeBlock(probe)
  }

  /**
   * Probes cookie generator for blocksize and prefix length
   * for a clean cut&paste
   * @return {object} object with blockSize and testLength
   */
  probeCookieGenerator() {
    let testVector = 'A'
    let outputSize = profileCookieGenerator.profileFor(testVector).length
    let testLength = outputSize
    while(testLength === outputSize) {
      testVector+='A'
      testLength = profileCookieGenerator.profileFor(testVector).length
    }
    return {
      blockSize: testLength - outputSize,
      testLength: testVector.length
    }
  }

  /**
   * Produces fake cookie based on probe info
   * @param {object} probe probe with blockSize and testLength
   * @return {string} fake encrypted cookie
   */
  produceFakeBlock(probe) {
    let dataPrefix = Buffer.alloc(probe.testLength).fill('A').toString()
    let dataSuffix = Buffer.alloc(11).fill(4)
    let testVector = dataPrefix + 'admin' + dataSuffix
    let fakeBlock = profileCookieGenerator.profileFor(testVector).slice(16,32)
    let validBlock = profileCookieGenerator.profileFor('test@test1.pl')
    return Buffer.concat([validBlock.slice(0, 32), fakeBlock])
  }
}

module.exports = new ProfileCookieSpoofer()

