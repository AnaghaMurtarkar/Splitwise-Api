const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  ExpensesModel = require(rootPrefix + '/app/models/Expense'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql'),
  expensesConstants = require(rootPrefix + '/lib/globalConstant/expense');

const mysqlInstance = mysqlProvider.getInstance();

class ListAllExpenses extends ServicesBase {
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

    oThis.expenses = [];
    oThis.userIds = [];
    oThis.userIdToUserNameMap = {};
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
        expenses: oThis.expenses
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
      Expenses = ExpensesModel(mysqlInstance, Sequelize),
      User = UserModel(mysqlInstance, Sequelize);

    const expensesResp = await Expenses.findAll({
      where: Sequelize.or({
          payer_id: oThis.currentUserId
        },
        { payee_id: oThis.currentUserId
        })
    });

    for(let index = 0; index<expensesResp.length; index++) {
      const expense = expensesResp[index].dataValues;
      oThis.userIds.push(expense.payer_id);
      oThis.userIds.push(expense.payee_id);
    }

    console.log('oThis.userIds =====', oThis.userIds);
    oThis.userIds = [...new Set(oThis.userIds)];
    console.log('oThis.userIds =====', oThis.userIds);

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

    for(let index = 0; index<expensesResp.length; index++) {
      const expense = expensesResp[index].dataValues;

      oThis.expenses.push({
        id: expense.id,
        payer_name: oThis.userIdToUserNameMap[expense.payer_id],
        payee_name: oThis.userIdToUserNameMap[expense.payee_id],
        amount: expense.amount,
        status: expensesConstants.statuses[expense.status]
      })
    }

  }
}

module.exports = ListAllExpenses;

