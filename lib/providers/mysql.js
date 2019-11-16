const Sequelize = require('sequelize');

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/coreConstants');

const mysqlDialect = 'mysql';

class MysqlProvider {
  constructor() {}

  getInstance() {
    const mysqlHost = coreConstants.MYSQL_HOST,
      mysqlUser = coreConstants.MYSQL_USER,
      password = coreConstants.MYSQL_PASSWORD,
      dbName = coreConstants.MYSQL_DB_NAME;

    return new Sequelize(dbName, mysqlUser, password, {
      host: mysqlHost,
      dialect: mysqlDialect,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
}

module.exports = new MysqlProvider();
