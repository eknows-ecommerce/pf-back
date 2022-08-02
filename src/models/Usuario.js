const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Usuario', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'usuario', 'visitante'),
      allowNull: false,
    },
    telefono: DataTypes.STRING,
    nombreCompleto: DataTypes.STRING,
    pais: DataTypes.STRING,
    ciudad: DataTypes.STRING,
  })
}
