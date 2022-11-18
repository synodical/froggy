module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "comment",
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
      userNick: {
        type: DataTypes.STRING(20),
        allowNULL: false,
      },
      contents: {
        type: DataTypes.STRING(1000),
        allowNULL: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      depth: {
        type: DataTypes.INTEGER,
        allowNULL: false,
        defaultValue: 0,
      },
      bundleId: {
        type: DataTypes.INTEGER,
      },
      bundleOrder: {
        type: DataTypes.INTEGER,
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
      tableName: "comment",
    }
  );
