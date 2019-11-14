module.exports = (sequelize, type) => {
  return sequelize.define('expense', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payer_id: type.INTEGER,
      payee_id: type.INTEGER,
      amount: type.BIGINT,
      status: type.INTEGER
    },
    {underscored: true})
};
