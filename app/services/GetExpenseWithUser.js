const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  UserBalancesModel = require(rootPrefix + '/app/models/UserBalance'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class GetExpenseWithUser extends ServicesBase {

  /**
   * Constructor for add expense class.
   *
   * @param {Object} params
   * @param {String} params.current_user_name;
   * @param {String} params.other_user_name;
   *
   * @constructor
   *
   * @augments ServicesBase
   */
  constructor(params) {
    super(params);
    const oThis = this;
    oThis.currentUserName = params.current_user_name;
    oThis.otherUserName = params.other_user_name;

    oThis.currentUserId = null;
    oThis.otherUserId = null;
  }

  /**
   * Main performer method.
   *
   * @returns {Promise<{data: {}, success: boolean}>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    const balance = await oThis._getExpense();

    return {
      success: true,
      data: {balance: balance}
    }
  }

  /**
   * Validate and sanitize input parameters.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this,
      User = UserModel(mysqlInstance, Sequelize);


    const userResponse = await User.findAll({
      where: {
        user_name: [oThis.currentUserName, oThis.otherUserName]
      }
    });

    for(let i=0;i<userResponse.length;i++) {
      const userObj = userResponse[i].dataValues;

      if(userObj.user_name === oThis.currentUserName) {
        oThis.currentUserId = userObj.id;
      } else if(userObj.user_name === oThis.otherUserName) {
        oThis.otherUserId = userObj.id;
      }
    }

    if(!oThis.currentUserId || !oThis.otherUserId) {
      return Promise.reject({
        internal_error_identifier: 'a_s_gewu_1',
        api_error_identifier: 'Invalid_other_user_name',
        debug_options: {current_user_name: oThis.currentUserName,
          other_user_name: oThis.otherUserName}
      })
    }
  }

  /**
   * Get expenses with a particular user from user_balances table.
   *
   * @returns {Promise<number|*>}
   * @private
   */
  async _getExpense() {
    const oThis = this,
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize);

    const currentUserPayerResp = await UserBalances.findAll({
      where: {
        payer_id: oThis.currentUserId,
        payee_id: oThis.otherUserId
      }
    });

    let currentUserPayerRespDataValues = null,
      otherUserPayerRespDataValues = null;

    if(currentUserPayerResp.length) {
      currentUserPayerRespDataValues = currentUserPayerResp[0].dataValues;
    }

    console.log('currentUserPayerRespDataValues =====', currentUserPayerRespDataValues);

    const otherUserPayerResp = await UserBalances.findAll({
      where: {
        payer_id: oThis.otherUserId,
        payee_id: oThis.currentUserId
      }
    });

    if(otherUserPayerResp.length) {
      otherUserPayerRespDataValues = otherUserPayerResp[0].dataValues;
    }

    console.log('otherUserPayerRespDataValues =====', otherUserPayerRespDataValues);

    if(currentUserPayerRespDataValues === null && otherUserPayerRespDataValues === null) {
      return 0;
    } else if(currentUserPayerRespDataValues === null) {
      return -otherUserPayerRespDataValues.amount;
    } else if(otherUserPayerRespDataValues === null) {
      return currentUserPayerRespDataValues.amount;
    } else {
      return (currentUserPayerRespDataValues.amount - otherUserPayerRespDataValues.amount);
    }


  }
}

module.exports = GetExpenseWithUser;
