const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Tag', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  })
}
