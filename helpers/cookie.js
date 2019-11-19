const rootPrefix = '..',
  basicHelper = require(rootPrefix + '/helpers/basic'),
  coreConstants = require(rootPrefix + '/coreConstants'),
  userConstants = require(rootPrefix + '/lib/globalConstant/user');

const cookieDefaultOptions = {
  httpOnly: true,
  signed: true,
  path: '/',
  domain: coreConstants.PA_COOKIE_DOMAIN,
  secure: false,
  sameSite: 'strict'
};

/**
 * Class for cookie helper.
 *
 * @class CookieHelper
 */
class CookieHelper {

  /**
   * Set login cookie.
   *
   * @param {object} responseObject
   * @param {string} cookieValue
   */
  setLoginCookie(responseObject, cookieValue) {
    let options = Object.assign({}, cookieDefaultOptions, {
      maxAge: 1000 * userConstants.cookieExpiryTime
    });

    // Set cookie.
    responseObject.cookie(userConstants.loginCookieName, cookieValue, options);
  }

  /**
   * Create login cookie.
   *
   * @param {Number} userId
   * @returns {string}
   */
  createLoginCookieValue(userId){
    const oThis = this,
      currentTimeStamp = Date.now();

    let stringToSign = userId + ':' + currentTimeStamp + coreConstants.COOKIE_SECRET;

    return userId + ':' + currentTimeStamp + ':' + basicHelper.createMd5Digest(stringToSign);
  }

}

module.exports = new CookieHelper();
