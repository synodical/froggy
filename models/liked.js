module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "liked",
    {
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        primaryKey: true,
      },
      targetId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "liked",
    }
  );
