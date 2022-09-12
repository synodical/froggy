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
db.Yarn = require("./yarn")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Pattern = require("./pattern")(sequelize, Sequelize);

//db.Yarn.hasMany(db.Image, { foreignKey: "targetId", sourceKey: "id" });
//db.Customer.hasMany(db.Yarn, { foreignKey: "customer_id", sourceKey: "id" });
//db.Yarn.belongsTo(db.Customer, { foreignKey: "customer_id", sourceKey: "id" });

module.exports = db;
