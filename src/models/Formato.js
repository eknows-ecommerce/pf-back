const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Formato', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  })
}
