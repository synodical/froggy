const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Customer = require("./customer")(sequelize, Sequelize);

// db.User.hasMany(db.Resident, { foreignKey: "user_id", sourceKey: "id" });
// db.Resident.belongsTo(db.User, { foreignKey: "user_id", sourceKey: "id" });

module.exports = db;
