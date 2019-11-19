const crypto = require('crypto');

class BasicHelper {
  /**
   * Log date format.
   *
   * @returns {string}
   */
  logDateFormat() {
    const date = new Date();

    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds() +
      '.' +
      date.getMilliseconds()
    );
  }

  /**
   * Create MD5.
   *
   * @param {string} string
   */
  createMd5Digest(string) {
    return crypto.createHash('md5')
      .update(string)
      .digest('hex');
  }
}

module.exports = new BasicHelper();
