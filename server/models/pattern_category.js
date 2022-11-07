module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "patternCategory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
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
      tableName: "patternCategory",
    }
  );
