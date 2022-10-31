module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "yarnReview",
     {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        yarnId: {
            type: DataTypes.STRING(40),
            allowNULL: false,
        },
        userId: {
            type: DataTypes.STRING(40),
            allowNULL: false,
        },
        userNick: {
            type: DataTypes.STRING(20),
            allowNULL: false,
        },
        contents: {
            type: DataTypes.STRING(4000),
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
      tableName: "yarnReview",
    }
  );
