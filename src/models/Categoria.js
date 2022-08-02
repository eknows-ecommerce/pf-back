const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Categoria', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    miniatura: DataTypes.STRING,
  })
}
