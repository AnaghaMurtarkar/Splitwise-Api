module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: type.STRING,
    last_name: type.STRING,
    email: {
      type: type.STRING,
      unique: true
    },
    salt: type.BLOB,
    password: type.TEXT
  },
    {underscored: true}
    )
};
