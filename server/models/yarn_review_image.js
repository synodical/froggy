module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "yarnReviewImage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      yarnReviewId: {
        type: DataTypes.INTEGER,
        allowNULL: false,
      },
      yarnId: {
        type: DataTypes.INTEGER,
        allowNULL: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "yarnReviewImage",
    }
  );
