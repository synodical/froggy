const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const db = {};
const sequelize = new Sequelize(
  config.MYSQL_DATABASE,
  config.MYSQL_USERNAME,
  config.MYSQL_PASSWORD,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Customer = require("./customer")(sequelize, Sequelize);

// db.User.hasMany(db.Resident, { foreignKey: "user_id", sourceKey: "id" });
// db.Resident.belongsTo(db.User, { foreignKey: "user_id", sourceKey: "id" });

module.exports = db;
