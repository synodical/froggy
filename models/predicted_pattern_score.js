module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "predictedPatternScore",
    {
      userId: {
        type: DataTypes.STRING(40),
        allowNULL: false,
        primaryKey: true,
      },
      patternRaverlyId: {
        type: DataTypes.INTEGER,
        allowNULL: false,
        primaryKey: true,
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
