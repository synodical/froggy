module.exports = (sequelize, DataTypes) => {
  sequelize.define("pattern ", {
    pattern_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.INTEGER,
    },
    difficulty: {
      type: DataTypes.FLOAT,
    },
    prmalink: {
      // 특징, 주제 같은거 ex)  wrapped-jacket
      type: DataTypes.STRING(100),
    },
    row_gauge: {
      type: DataTypes.FLOAT,
    },
    yarndage: {
      type: DataTypes.STRING(40),
      allowNULL: true,
      unique: true,
    },
    ply: {
      type: DataTypes.INTEGER,
    },
    craft: {
      type: DataTypes.INTEGER,
    },
    gauge: {
      type: DataTypes.STRING(7),
    },
    gauge_pattern: {
      type: DataTypes.STRING(100),
    },
    keyword: {
      type: DataTypes.INTEGER,
    },
  });
};
