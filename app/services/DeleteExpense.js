const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  ExpensesModel = require(rootPrefix + '/app/models/Expense'),
  UserBalancesModel = require(rootPrefix + '/app/models/UserBalance'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql'),
  expensesConstants = require(rootPrefix + '/lib/globalConstant/expense');

const mysqlInstance = mysqlProvider.getInstance();

class DeleteExpense extends ServicesBase {
  /**
   * Constructor for DeleteExpense.
   *
   * @param {Object} params
   * @param {String} params.current_user_name;
   * @param {Number} params.expense_id;
   *
   * @augments ServicesBase
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.currentUserName = params.current_user_name;
    oThis.expenseId = params.expense_id;

    oThis.currentUserId = null;
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

    await oThis._deleteExpense();

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
      Expenses = ExpensesModel(mysqlInstance, Sequelize);

    const expenseResponse = await Expenses.findAll({
      where: {
        id: oThis.expenseId
      }
    });

    if(expenseResponse.length === 0) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_de_1',
        api_error_identifier: 'invalid_expense_id',
        debug_options: {expense_id: oThis.expenseId}
      })
    }

    oThis.expense = expenseResponse[0].dataValues;

    if(oThis.expense.status === +expensesConstants.invertedStatuses[expensesConstants.deletedStatus]) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_de_2',
        api_error_identifier: 'expense_already_deleted',
        debug_options: {expense_id: oThis.expenseId}
      })
    }
  }

  /**
   * Delete expense.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _deleteExpense() {
    const oThis = this,
      Expenses = ExpensesModel(mysqlInstance, Sequelize),
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize);

    // This is intentional.
    // Here, we will create reverse expense so that we won't be having negative balances.
    const payerId = oThis.expense.payee_id,
      payeeId = oThis.expense.payer_id,
      amount = oThis.expense.amount;

    const updateExpensesResp = await Expenses.update({
        status: expensesConstants.invertedStatuses[expensesConstants.deletedStatus]
      },
      { where:
          {
            id: oThis.expenseId,
            status: expensesConstants.invertedStatuses[expensesConstants.activeStatus]
          }
      });

    if(updateExpensesResp[0].affectedRows === 0) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_de_3',
        api_error_identifier: 'expense_already_deleted',
        debug_options: {expense_id: oThis.expenseId}
      })
    }

    const updateUserBalancesResp = await mysqlInstance.query(`UPDATE user_balances SET amount = amount + ? WHERE (payer_id = ? and payee_id = ?)`,
      {replacements:[amount, payerId, payeeId]});

    if(updateUserBalancesResp[0].affectedRows > 0) {
      // Do nothing as there are some updated rows.
    } else {
      const userBalancesResp = await UserBalances.create({
        payer_id: payerId,
        payee_id: payeeId,
        amount: amount
      });

    }

  }
}

module.exports = DeleteExpense;
