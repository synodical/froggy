module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "likedPattern",
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
      patternId: {
        type: DataTypes.INTEGER(40),
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
      tableName: "likedPattern",
    }
  );
