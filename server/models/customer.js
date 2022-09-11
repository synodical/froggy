module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "customer",
    {
      id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      pwd: {
        type: DataTypes.STRING(100),
        allowNULL: false,
      },
      nick: {
        type: DataTypes.STRING(10),
      },
      email: {
        type: DataTypes.STRING(40),
        allowNULL: true,
        unique: true,
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
      tableName: "customer",
    }
  );
