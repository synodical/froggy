module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "yarn",
    {
      gauge_divisor: {
        type: DataTypes.INTEGER,
      },
      grams: {
        type: DataTypes.INTEGER,
      },
      id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      machine_washable: {
        type: DataTypes.BOOLEAN,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNULL: false,
      },
      yardage: {
        type: DataTypes.INTEGER,
      },
      yarn_company_name: {
        type: DataTypes.STRING(50),
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      tableName: "yarn",
    }
  );
