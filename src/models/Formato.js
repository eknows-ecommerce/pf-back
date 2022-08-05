const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Formato', {
    tipo: {
      type: DataTypes.ENUM('fisico', 'ebook', 'audiolibro'),
      allowNull: false,
    },
  })
}
