const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  UserBalancesModel = require(rootPrefix + '/app/models/UserBalance'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class ListAllBalances extends ServicesBase {
  /**
   * Constructor for ListAll.
   *
   * @param {Object} params
   * @param {Number} params.current_user_id
   */
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.currentUserId = params.current_user_id;

    oThis.userIdToBalanceMap = {};
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

    await oThis._listAll();

    return {
      success: true,
      data: {}
    }
  }

  /**
   * Validate and sanitize.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

  }

  /**
   * List all.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _listAll() {
    const oThis = this,
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize);

    const userBalancesResp = await UserBalances.findAll({
      where: Sequelize.or({
          payer_id: oThis.currentUserId
        },
         { payee_id: oThis.currentUserId
         })
    });

    for(let index = 0; index<userBalancesResp.length; index++) {
      const userBalance = userBalancesResp[index].dataValues;

      if(userBalance.payer_id === oThis.currentUserId) {
        oThis.userIdToBalanceMap[userBalance.payee_id] = oThis.userIdToBalanceMap[userBalance.payee_id] || 0;
        oThis.userIdToBalanceMap[userBalance.payee_id] = oThis.userIdToBalanceMap[userBalance.payee_id] + userBalance.amount;
      } else {
        oThis.userIdToBalanceMap[userBalance.payer_id] = oThis.userIdToBalanceMap[userBalance.payer_id] || 0;
        oThis.userIdToBalanceMap[userBalance.payer_id] = oThis.userIdToBalanceMap[userBalance.payer_id] - userBalance.amount;
      }
    }
    console.log('oThis.userIdToBalanceMap ========', oThis.userIdToBalanceMap);
  }
}

module.exports = ListAllBalances;

