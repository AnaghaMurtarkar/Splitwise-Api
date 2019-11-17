const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql'),
  localCipherHelper = require(rootPrefix + '/lib/localCipher');

class RegisterUser extends ServicesBase{
  constructor(params) {
    super(params);
    const oThis = this;

    oThis.firstName = params.first_name;
    oThis.lastName = params.last_name;
    oThis.email = params.email;
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

    const userObj = await oThis._createUser();

    return {
      success: true,
      data: {
        user: userObj
      }
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

    oThis.firstName = oThis.firstName.trim();
    oThis.lastName = oThis.lastName.trim();
    oThis.userName = oThis.userName.trim();

    if(oThis.firstName.length > 30 || !Validators.validateName(oThis.firstName)) {
      return Promise.reject({
        internal_error_identifier: 'a_s_r_1',
        api_error_identifier: 'invalid_first_name',
        debug_options: {}
      })
    }

    if(oThis.lastName.length > 30 || !Validators.validateName(oThis.lastName)) {
      return Promise.reject({
        internal_error_identifier: 'a_s_r_2',
        api_error_identifier: 'invalid_last_name',
        debug_options: {}
      })
    }

    if(!Validators.validateEmail(oThis.email)) {
      return Promise.reject({
        internal_error_identifier: 'a_s_r_3',
        api_error_identifier: 'invalid_email',
        debug_options: {}
      })
    }

    // TODO: Validate username

    if(oThis.password.length<6) {
      return Promise.reject({
        internal_error_identifier: 'a_s_r_4',
        api_error_identifier: 'password_too_small',
        debug_options: {}
      })
    }


    if(oThis.password.length>16) {
      return Promise.reject({
        internal_error_identifier: 'a_s_r_5',
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
  async _createUser() {
    const oThis = this,
      mysqlInstance = mysqlProvider.getInstance(),
      User = UserModel(mysqlInstance, Sequelize);

    const salt = localCipherHelper.generateRandomSalt(),
      encryptedPassword = localCipherHelper.encrypt(salt, oThis.password);

    const userCreationResponse = await User.create({
      first_name: oThis.firstName,
      last_name: oThis.lastName,
      email: oThis.email,
      user_name: oThis.userName,
      salt: salt,
      password: encryptedPassword
    }).catch(function(err) {
      if(err.parent.code === 'ER_DUP_ENTRY') {
        return Promise.reject({
          internal_error_identifier: 'a_s_r_6',
          api_error_identifier: 'email_already_used',
          debug_options: {}
        })
      }
    });

    console.log(JSON.stringify(userCreationResponse));
    return userCreationResponse.dataValues;
  }
}

module.exports = RegisterUser;


