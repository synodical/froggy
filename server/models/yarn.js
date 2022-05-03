module.exports = (sequelize, DataTypes) => {
  sequelize.define("yarn", {
    yarn_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
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
      type: DataTypes.STRING(),
    },
    atrribute: {
      type: DataTypes.STRING(),
    },
    explanation: {
      type: DataTypes.STRING(),
    },
    color_palate: {},
  });
};
