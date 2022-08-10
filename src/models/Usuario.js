const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Usuario', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'usuario', 'visitante'),
      allowNull: false,
      defaultValue: 'usuario',
    },
    telefono: DataTypes.STRING,
    picture: DataTypes.STRING,
    name: DataTypes.STRING,
    pais: DataTypes.STRING,
    ciudad: DataTypes.STRING,
  })
}
