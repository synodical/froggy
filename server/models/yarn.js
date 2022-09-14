module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "yarn",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gaugeDivisor: {
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
      machineWashable: {
        type: DataTypes.BOOLEAN,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNULL: false,
      },
      yardage: {
        type: DataTypes.INTEGER,
      },
      yarnCompanyName: {
        type: DataTypes.STRING(50),
      },
      yarnCompanyUrl: {
        type: DataTypes.STRING(100),
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "yarn",
    }
  );
