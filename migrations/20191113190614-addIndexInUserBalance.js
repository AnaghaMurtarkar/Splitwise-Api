'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('user_balances', ['payer_id'],{
      indexName: 'idx1'
    }).then(() => queryInterface.addIndex('user_balances', ['payee_id'],{
      indexName: 'idx2'
    }));
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeIndex('user_balances', 'user_balances_payer_id')
      .then(() => queryInterface.removeIndex('user_balances', 'idx2'))
  }
};
