// module.exports = (sequelize, DataTypes) =>
//   sequelize.define(
//     "liked",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       targetType: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "",
//       },
//       targetId: {
//         type: DataTypes.BIGINT,
//       },
//       customerId: {
// id: {
//   type: sequelize.INTEGER,
//   autoIncrement: true,
//   primaryKey: true,
// },
//       },
//     },
//     {
//       freezeTableName: true,
//       paranoid: true.valueOf,
//       tableName: "liked",
//     }
//   );
