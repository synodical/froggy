module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "patternReviewImage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patternReviewId: {
        type: DataTypes.INTEGER,
        allowNULL: false,
      },
      patternId: {
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
      tableName: "patternReviewImage",
    }
  );
