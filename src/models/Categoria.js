const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Categoria', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    miniatura: DataTypes.STRING,
  })
}
