module.exports = (sequelize, type) => {
  return sequelize.define('user_balance',{
    id: {
      type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    payer_id: type.INTEGER,
    payee_id: type.INTEGER,
    amount: type.BIGINT
  },
    {underscored: true})
};
