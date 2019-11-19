class UserConstants {

  get cookieExpiryTime() {
    return 60 * 60 * 24 * 60; // 60 days
  }

  get loginCookieName() {
    return 'lcn';
  }
}

module.exports = new UserConstants();
