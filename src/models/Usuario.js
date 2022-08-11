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
    isBan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
