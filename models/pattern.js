module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "pattern",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      raverlyId: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      downloadable: {
        type: DataTypes.BOOLEAN,
      },
      downloadLocation: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNULL: false,
      },
      notes: {
        type: DataTypes.TEXT("long"),
        allowNULL: false,
      },
      price: {
        type: DataTypes.DOUBLE,
      },
      currency: {
        type: DataTypes.STRING,
      },
      currencySymbol: {
        type: DataTypes.STRING,
      },
      author: {
        type: DataTypes.STRING,
      },
      difficultyAverage: {
        type: DataTypes.DOUBLE,
      },
      difficultyCount: {
        type: DataTypes.INTEGER,
      },
      ratingAverage: {
        type: DataTypes.DOUBLE,
      },
      ratingCount: {
        type: DataTypes.INTEGER,
      },
      rowGauge: {
        type: DataTypes.INTEGER,
      },
      gauge: {
        type: DataTypes.INTEGER,
      },
      gaugeDescription: {
        type: DataTypes.STRING,
      },
      gaugeDivisor: {
        type: DataTypes.INTEGER,
      },
      url: {
        type: DataTypes.STRING,
      },
      yardage: {
        type: DataTypes.INTEGER,
      },
      attributeIdArr: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
      },
      craft: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING,
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
      tableName: "pattern",
    }
  );
