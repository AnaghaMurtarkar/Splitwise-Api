const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  UserBalancesModel = require(rootPrefix + '/app/models/UserBalance'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class SettleUpWithUser extends ServicesBase {
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.currentUserId = +params.current_user_id;
    oThis.otherUserName = params.other_user_name;

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

    await oThis._settleUp();

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
    const oThis = this,
      User = UserModel(mysqlInstance, Sequelize);


    const userResponse = await User.findAll({
      where: {
        user_name: [oThis.otherUserName]
      }
    });

    if(userResponse.length) {
      oThis.otherUserId = userResponse[0].dataValues.id;
    }

    if(!oThis.otherUserId) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_suwu_1',
        api_error_identifier: 'Invalid_other_user_name',
        debug_options: {other_user_name: oThis.otherUserName}
      })
    }
  }

  /**
   * Settle up with some user.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _settleUp() {
    const oThis = this,
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize);

    await UserBalances.update({
      amount: 0
      },
      { where:
          {
            payer_id: oThis.currentUserId,
            payee_id: oThis.otherUserId
          }
      });

    await UserBalances.update({
        amount: 0
      },
      { where:
          {
            payer_id: oThis.otherUserId,
            payee_id: oThis.currentUserId
          }
      });
  }
}

module.exports = SettleUpWithUser;
