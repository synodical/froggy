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

db.User = require("./user")(sequelize, Sequelize);
db.Yarn = require("./yarn")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Pattern = require("./pattern")(sequelize, Sequelize);
db.Fiber = require("./fiber")(sequelize, Sequelize);
db.LikedYarn = require("./liked_yarn")(sequelize, Sequelize);
db.LikedPattern = require("./liked_pattern")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.PatternAttribute = require("./pattern_attribute")(sequelize, Sequelize);
db.PatternCategory = require("./pattern_category")(sequelize, Sequelize);
db.PatternReview = require("./pattern_review")(sequelize, Sequelize);
db.YarnReview = require("./yarn_review")(sequelize, Sequelize);
db.PredictedPatternScore = require("./predicted_pattern_score")(
  sequelize,
  Sequelize
);

db.Yarn.hasMany(db.Fiber);
db.Fiber.belongsTo(db.Yarn);

// landings : landingImages -> 1:N
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post, {
  onDelete: "CASCADE",
});

//db.Yarn.hasMany(db.Image, { foreignKey: "targetId", sourceKey: "id" });
//db.Customer.hasMany(db.Yarn, { foreignKey: "customer_id", sourceKey: "id" });
//db.Yarn.belongsTo(db.Customer, { foreignKey: "customer_id", sourceKey: "id" });

module.exports = db;
