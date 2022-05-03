module.exports = (sequelize, DataTypes) => {
  sequelize.define("customer", {
    customer_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    customer_ps: {
      type: DataTypes.STRING(30),
      allowNULL: false,
    },
    customer_nick: {
      type: DataTypes.STRING(10),
    },
    customer_email: {
      type: DataTypes.STRING(40),
      allowNULL: true,
      unique: true,
    },
    customer_name: {
      type: DataTypes.STRING(7),
    },
    custmoer_gender: {
      type: DataTypes.INTEGER,
    },
    customer_birth: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  });
};
