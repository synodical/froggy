module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "predictedPatternScore",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(40),
        allowNULL: false,
      },
      patternRaverlyId: {
        type: DataTypes.INTEGER,
        allowNULL: false,
      },
      predictedScore: {
        type: DataTypes.FLOAT,
        allowNULL: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "predictedPatternScore",
    }
  );
