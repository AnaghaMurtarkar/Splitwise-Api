const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
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
    oThis.userIdToUserNameMap = {};
    oThis.balances = [];
    oThis.userIds = [];
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
      data: {
        balances: oThis.balances
      }
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
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize),
      User = UserModel(mysqlInstance, Sequelize);

    const userBalancesResp = await UserBalances.findAll({
      where: Sequelize.or({
          payer_id: oThis.currentUserId
        },
         { payee_id: oThis.currentUserId
         })
    });

    for(let index = 0; index<userBalancesResp.length; index++) {
      const userBalance = userBalancesResp[index].dataValues;

      if(userBalance.payer_id ===  +oThis.currentUserId) {
        oThis.userIds.push(userBalance.payee_id);
        oThis.userIdToBalanceMap[userBalance.payee_id] = oThis.userIdToBalanceMap[userBalance.payee_id] || 0;
        oThis.userIdToBalanceMap[userBalance.payee_id] = oThis.userIdToBalanceMap[userBalance.payee_id] + userBalance.amount;
      } else {
        oThis.userIds.push(userBalance.payer_id);
        oThis.userIdToBalanceMap[userBalance.payer_id] = oThis.userIdToBalanceMap[userBalance.payer_id] || 0;
        oThis.userIdToBalanceMap[userBalance.payer_id] = oThis.userIdToBalanceMap[userBalance.payer_id] - userBalance.amount;
      }
    }

    oThis.userIds = [...new Set(oThis.userIds)];

    const userResponse = await User.findAll({
      where: {
        id: oThis.userIds
      }
    });

    for(let index = 0; index<userResponse.length; index++) {
      const user = userResponse[index].dataValues;
      oThis.userIdToUserNameMap[user.id] = user.user_name;
    }
    console.log('oThis.userIdToUserNameMap=====', oThis.userIdToUserNameMap);
    console.log('oThis.userIdToBalanceMap ========', oThis.userIdToBalanceMap);

    for(let userId in oThis.userIdToBalanceMap) {
      const balance = {};
      balance['user_id'] = userId;
      balance['user_name'] = oThis.userIdToUserNameMap[userId];
      balance['balance'] = oThis.userIdToBalanceMap[userId];

      oThis.balances.push(balance);
    }
  }
}

module.exports = ListAllBalances;

