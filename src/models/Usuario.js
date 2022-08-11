const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Usuario', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente', 'operador'),
      allowNull: false,
      defaultValue: 'cliente',
    },
    telefono: DataTypes.STRING,
    picture: DataTypes.STRING,
    name: DataTypes.STRING,
    pais: DataTypes.STRING,
    ciudad: DataTypes.STRING,
  })
}

// const { DataTypes } = require('sequelize')

// module.exports = (sequelize) => {
//   sequelize.define('Usuario', {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     contraseña: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     rol: {
//       type: DataTypes.ENUM('admin', 'usuario', 'visitante'),
//       allowNull: false,
//     },
//     telefono: DataTypes.STRING,
//     nombreCompleto: DataTypes.STRING,
//     pais: DataTypes.STRING,
//     ciudad: DataTypes.STRING,
//   })
// }
