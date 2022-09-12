module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "image",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      targetId: {
          type: DataTypes.BIGINT,
      },
      imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "image",
    }
  );
