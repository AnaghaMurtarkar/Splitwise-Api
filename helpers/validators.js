const BigNumber = require('bignumber.js');
/**
 * Class for common validators.
 *
 * @class CommonValidator
 */
class CommonValidator {
  
  /**
   * Is valid Boolean?
   *
   * @returns {boolean}
   */
  static validateBoolean(str) {
    const oThis = this;
    
    if (oThis.isVarNullOrUndefined(str)) {
      return false;
    }
    
    return str === 'true' || str === 'false' || str === true || str === false;
  }
  
  /**
   * Is var null or undefined?
   *
   * @param {object/string/integer/boolean} variable
   *
   * @returns {boolean}
   */
  static isVarNullOrUndefined(variable) {
    return typeof variable === 'undefined' || variable == null;
  }
  
  /**
   * Is var null?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarNull(variable) {
    return variable == null;
  }
  
  /**
   * Is var undefined?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarUndefined(variable) {
    return typeof variable === 'undefined';
  }
  
  /**
   * Is var not blank or null?
   *
   * @param {array<string>} variable
   *
   * @returns {boolean}
   */
  static validateNonBlankString(variable) {
    return CommonValidator.validateNonBlankStringArray([variable]);
  }
  
  /**
   * Is var not blank or null
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateNonBlankStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        const variable = array[index];
        if (
          CommonValidator.isVarNullOrUndefined(variable) ||
          !CommonValidator.validateString(variable) ||
          variable == ''
        ) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Is var true?
   *
   * @returns {boolean}
   */
  static isVarTrue(variable) {
    return variable === true || variable === 'true';
  }
  
  /**
   * Is var false?
   *
   * @returns {boolean}
   */
  static isVarFalse(variable) {
    return variable === false || variable === 'false';
  }
  
  /**
   * Is var integer?
   *
   * @returns {boolean}
   */
  static validateInteger(variable) {
    try {
      const variableInBn = new BigNumber(String(variable));
      // Variable is integer and its length is less than 37 digits
      if (variableInBn.isInteger() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (e) {}
    
    return false;
  }
  
  /**
   * Is integer non zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonZeroInteger(variable) {
    const oThis = this;
    
    if (oThis.validateInteger(variable)) {
      return Number(variable) > 0;
    }
    
    return false;
  }
  
  /**
   * Check if number is non negative
   *
   * @param variable
   * @returns {boolean}
   */
  static validateNonNegativeNumber(variable) {
    const oThis = this;
    
    return Number(variable) > 0;
  }
  
  /**
   * Check if number is non negative
   *
   * @param variable
   * @returns {boolean}
   */
  static validateNonNegativeDecimalUpto3Places(variable) {
    const oThis = this,
      regexp = /^\d+\.\d{0,3}$/;

    return regexp.test(variable)
  }
  
  /**
   * Is integer non negative
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonNegativeInteger(variable) {
    const oThis = this;
    
    if (oThis.validateInteger(variable)) {
      return Number(variable) >= 0;
    }
    
    return false;
  }
  
  /**
   * Is integer zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateZeroInteger(variable) {
    const oThis = this;
    
    if (oThis.validateInteger(variable)) {
      return Number(variable) === 0;
    }
    
    return false;
  }
  
  /**
   * Is string valid ?
   *
   * @returns {boolean}
   */
  static validateString(variable) {
    return typeof variable === 'string';
  }
  
  /**
   * Is var a string containing only alphabets?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }
    
    return /^[a-z]+$/i.test(variable);
  }
  
  /**
   * Is var a string containing alpha numeric chars?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaNumericString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }
    
    return /^[a-z0-9]+$/i.test(variable);
  }
  
  /**
   * Is var a string containing alpha numeric chars ?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaNumericCommonSpecialCharString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }
    
    return /^[a-z0-9\_]+$/i.test(variable);
  }
  
  /**
   * Is var a string containing alpha numeric chars?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateMaxLengthMediumString(variable) {
    return variable.length < 255;
  }
  
  /**
   * Is string ordering?
   *
   * @param {string} str
   *
   * @returns {boolean}
   */
  static validateOrderingString(str) {
    return ['asc', 'desc'].includes(str.toLowerCase());
  }
  
  /**
   * Is valid integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateInteger(array[index])) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Is valid non zero integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateNonZeroIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateNonZeroInteger(array[index])) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Is valid UUIDv4 array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateUuidV4Array(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateUuidV4(array[index])) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }
  
  
  /**
   *  Is valid array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateArray(array) {
    return Array.isArray(array);
  }
  
  /**
   * Check uuid v4 validation.
   *
   * @param {string} uuid
   *
   * @returns {boolean}
   */
  static validateUuidV4(uuid) {
    const oThis = this;
    
    if (!oThis.isVarNullOrUndefined(uuid) && typeof uuid === 'string') {
      return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid);
    }
    
    return false;
  }
  
  /**
   * Check if timestamp is valid or not.
   *
   * @param {string} variable: variable
   *
   * @returns {boolean}
   */
  static validateTimestamp(variable) {
    if (!CommonValidator.validateInteger(variable)) {
      return false;
    }
    
    return /^[0-9]{10}$/.test(variable);
  }
  
  /**
   * Check if variable is object and non-empty.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateNonEmptyObject(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object') {
      return false;
    }
    
    for (const prop in variable) {
      try {
        if (Object.prototype.hasOwnProperty.call(variable, prop)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    
    return false;
  }
  
  /**
   * Validate object.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateObject(variable) {
    return !(CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object');
  }
  
  /**
   * Validate API validateTransactionStatusArray
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateString(array[index])) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }
}

module.exports = CommonValidator;
