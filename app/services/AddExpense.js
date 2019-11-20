const Sequelize = require('sequelize');

const rootPrefix = '../..',
  Validators = require(rootPrefix + '/lib/Validator'),
  UserModel = require(rootPrefix + '/app/models/User'),
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  ExpensesModel = require(rootPrefix + '/app/models/Expense'),
  UserBalancesModel = require(rootPrefix + '/app/models/UserBalance'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql'),
  expensesConstants = require(rootPrefix + '/lib/globalConstant/expense');

const mysqlInstance = mysqlProvider.getInstance();

class AddExpense extends ServicesBase {

  /**
   * Constructor for add expense class.
   *
   * @param {Object} params
   * @param {String} params.current_user_id;
   * @param {String} params.payer_user_name;
   * @param {String} params.payee_user_name;
   * @param {Number} params.owe_amount;
   * @param {Number} params.description;
   *
   * @constructor
   *
   * @augments ServicesBase
   */
  constructor(params) {
    super(params);
    const oThis = this;
    oThis.currentUserId = +params.current_user_id;
    oThis.payerUserName = params.payer_user_name;
    oThis.payeeUserName = params.payee_user_name;
    oThis.oweAmount = params.owe_amount;
    oThis.description = params.description;

    oThis.payerUserId = null;
    oThis.payeeUserId = null;
    oThis.expenseId = null;
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

    await oThis._addExpense();

    return {
      success: true,
      data: {
        expense_id: oThis.expenseId
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
    const oThis = this,
      User = UserModel(mysqlInstance, Sequelize);

    const userResponse = await User.findAll({
      where: {
        user_name: [oThis.payerUserName, oThis.payeeUserName]
      }
    });

    for(let i=0;i<userResponse.length;i++) {
      const userObj = userResponse[i].dataValues;

      if(userObj.user_name === oThis.payerUserName) {
        oThis.payerUserId = userObj.id;
      } else if(userObj.user_name === oThis.payeeUserName) {
        oThis.payeeUserId = userObj.id;
      }
    }

    if(!oThis.payerUserId || !oThis.payeeUserId) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_ae_1',
        api_error_identifier: 'Invalid_payee_or_payer',
        debug_options: {payer_user_name: oThis.payerUserName,
        payee_user_name: oThis.payeeUserName}
      })
    }

    if(!(oThis.payerUserId === oThis.currentUserId || oThis.payeeUserId === oThis.currentUserId)){
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_ae_1',
        api_error_identifier: 'payee_or_payer_should_be_logged_in',
        debug_options: {
          payer_user_id: oThis.payerUserId,
          payee_user_id: oThis.payeeUserId,
          current_user_id: oThis.currentUserId}
      })
    }
  }

  /**
   * Add expense to expenses table and balances table.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _addExpense() {
    const oThis = this,
      Expenses = ExpensesModel(mysqlInstance, Sequelize),
      UserBalances = UserBalancesModel(mysqlInstance, Sequelize);

    const expensesCreationResp = await Expenses.create({
      payer_id: oThis.payerUserId,
      payee_id: oThis.payeeUserId,
      amount: oThis.oweAmount,
      description: oThis.description,
      status: expensesConstants.invertedStatuses[expensesConstants.activeStatus]
    });

    oThis.expenseId = expensesCreationResp.dataValues.id;

    const updateResp = await mysqlInstance.query(`UPDATE user_balances SET amount = amount + ? WHERE (payer_id = ? and payee_id = ?)`,
      {replacements:[oThis.oweAmount, oThis.payerUserId, oThis.payeeUserId]});

    if(updateResp[0].affectedRows > 0) {
      // Do nothing as there are some updated rows.
    } else {
      await UserBalances.create({
        payer_id: oThis.payerUserId,
        payee_id: oThis.payeeUserId,
        amount: oThis.oweAmount
      }).catch(function(err) {
        if(err.parent.code === 'ER_DUP_ENTRY') {
          return Promise.reject({
            success: false,
            code: 500,
            internal_error_identifier: 'a_s_ae_3',
            api_error_identifier: 'something_went_wrong',
            debug_options: {}
          })
        }
      });
    }
  }
}

module.exports = AddExpense;
