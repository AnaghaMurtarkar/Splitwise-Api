'use strict';

/*
  * Local Cipher to encrypt and decrypt client keys
  *
  * * Author: Pankaj
  * * Date: 18/01/2018
  * * Reviewed by:
*/

const rootPrefix = '../..',
  crypto = require('crypto'),
  algorithm = 'aes-256-cbc',
  secretSplitter = '--';

class LocalCipher {
  constructor() {}

  encrypt(salt, string) {
    var iv = this.generateRandomIv();

    var encrypt = crypto.createCipheriv(algorithm, salt, iv);
    var theCipher = encrypt.update(string, 'utf8', 'base64');
    theCipher += encrypt.final('base64');

    theCipher += secretSplitter + iv;
    return theCipher;
  }

  decrypt(salt, encryptedString) {
    var ar = encryptedString.toString().split(secretSplitter),
      theCipher = ar[0],
      iv = ar[1];

    var decrypt = crypto.createDecipheriv(algorithm, salt, iv);
    var string = decrypt.update(theCipher, 'base64', 'utf8');
    string += decrypt.final('utf8');

    return string;
  }

  generateRandomIv() {
    var iv = new Buffer(crypto.randomBytes(16));
    return iv.toString('hex').slice(0, 16);
  }

  /**
   * Generate random salt
   *
   * @returns {string}
   */
  generateRandomSalt() {
    return crypto.randomBytes(16).toString('hex');
  }
}

module.exports = new LocalCipher();
