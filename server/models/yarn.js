module.exports = (sequelize, DataTypes) => {
  sequelize.define("yarn", {
    yarn_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    yarn_company: {
      type: DataTypes.STRING(20),
    },
    weight: {
      type: DataTypes.STRING(10),
    },
    yarndage: {
      type: DataTypes.STRING(40),
      allowNULL: true,
      unique: true,
    },
    gauge: {
      type: DataTypes.STRING(7),
    },
    hook_size: {
      type: DataTypes.INTEGER,
    },
    fiber: {
      type: DataTypes.STRING(50),
    },
    atrribute: {
      type: DataTypes.STRING(100),
    },
    explanation: {
      type: DataTypes.STRING(2000),
    },
    color_palate: {
      type: DataTypes.STRING(8),
    },
    color_number: {
      type: DataTypes.INTEGER,
    },
    color_name: {
      type: DataTypes.STRING(10),
    },
  });
};
