module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "image",
    {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        targetType: {
            type: sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        targetId: {
            type: sequelize.BIGINT,
        },
        imageUrl: {
            type: sequelize.STRING,
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
