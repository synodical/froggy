module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "yarn",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gauge_divisor: {
        type: DataTypes.INTEGER,
      },
      grams: {
        type: DataTypes.INTEGER,
      },
      raverlyId: {
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
      isDel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N',
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      tableName: "yarn",
    }
  );
