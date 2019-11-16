const rootPrefix = '..';

class Validator {
  constructor() {}

  static validateName(name) {
    if (typeof name !== 'string') {
      return false;
    }

    return /^[a-zA-Z]+$/.test(name);
  }

  static validateEmail(email) {
    if (typeof email !== 'string') {
      return false;
    }

    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }
}

module.exports = Validator;
