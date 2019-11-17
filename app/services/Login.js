const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql'),
  localCipherHelper = require(rootPrefix + '/lib/localCipher');

class LoginUser extends ServicesBase{
  constructor(params) {
    super(params);
    const oThis = this;

    oThis.userName = params.user_name;
    oThis.password = params.password;
  }

  /**
   * Main performer method.
   *
   * @returns {{data: {}, success: boolean}}
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._getUser();

    return {
      success: true,
      data: {}
    }
  }

  /**
   * Validate and sanitize input parameters.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

   // Validate user name.

    if(oThis.password.length<6) {
      return Promise.reject({
        internal_error_identifier: 'a_s_l_2',
        api_error_identifier: 'password_too_small',
        debug_options: {}
      })
    }


    if(oThis.password.length>16) {
      return Promise.reject({
        internal_error_identifier: 'a_s_l_3',
        api_error_identifier: 'password_too_large',
        debug_options: {}
      })
    }
  }

  /**
   * Create user.
   *
   * @returns {Promise<<Model<any, any>>|Domain|*|Namespace.active|<void>>}
   * @private
   */
  async _getUser() {
    const oThis = this,
      mysqlInstance = mysqlProvider.getInstance(),
      User = UserModel(mysqlInstance, Sequelize);

    const userResponse = await User.findAll({
      where: {
        user_name: oThis.userName
      }
    });

    const dbRow = userResponse[0].dataValues;

    const decryptedPassword = localCipherHelper.decrypt(dbRow.salt, dbRow.password);

    if(oThis.password === decryptedPassword) {
      // Create cookie
    } else {
      return Promise.reject({
        internal_error_identifier: 'a_s_l_4',
        api_error_identifier: 'wrong_password',
        debug_options: {}
      })
    }
  }
}

module.exports = LoginUser;


