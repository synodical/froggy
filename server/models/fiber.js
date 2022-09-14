module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "fiber",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNULL: false,
      },
      raverlyId: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      typeId: {
        type: DataTypes.BIGINT,
      },
      animalFiber: {
        type: DataTypes.BOOLEAN,
      },
      vegetableFiber: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      freezeTableName: true,
      paranoid: true.valueOf,
      tableName: "fiber",
    }
  );
