const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Review', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lenguaje: DataTypes.STRING,
  })
}
