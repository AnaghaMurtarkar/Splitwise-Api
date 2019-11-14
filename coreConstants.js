/**
 * Class for core constants.
 *
 * @class CoreConstants
 */
class CoreConstants {

  get PA_PORT() {
    return process.env.PA_PORT;
  }

  get MYSQL_HOST() {
    return process.env.MYSQL_HOST;
  }

  get MYSQL_USER() {
    return process.env.MYSQL_USER;
  }

  get MYSQL_PASSWORD() {
    return process.env.MYSQL_PASSWORD;
  }

  get MYSQL_DB_NAME() {
    return process.env.MYSQL_DB_NAME;
  }
}

module.exports = new CoreConstants();
