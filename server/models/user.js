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
      gender: {
        type: DataTypes.INTEGER,
      },
      birth: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "user",
    }
  );
