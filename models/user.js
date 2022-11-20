module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNULL: false,
      },
      nick: {
        type: DataTypes.STRING(10),
      },
      name: {
        type: DataTypes.STRING(7),
      },
      proficiency: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.INTEGER,
      },
      crochet: {
        type: DataTypes.INTEGER,
      },
      knitting: {
        type: DataTypes.INTEGER,
      },
      birth: {
        type: DataTypes.DATE,
      },
      favoritePatternAttributeIdArr: {
        type: DataTypes.STRING,
      },
      isSetProfile: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N",
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.INTEGER,
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
      tableName: "user",
    }
  );
