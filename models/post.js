module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "post",
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
      category: {
        type: DataTypes.STRING(20),
        allowNULL: false,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNULL: false,
      },
      contents: {
        type: DataTypes.STRING(4000),
        allowNULL: false,
      },
      htmlContents: {
        type: DataTypes.STRING(4000),
        allowNULL: false,
      },
      commentCount: {
        type: DataTypes.INTEGER,
      },
      likeCount: {
        type: DataTypes.INTEGER,
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
      tableName: "post",
    }
  );
