const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Review', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    fechaPublicacion: DataTypes.DATE,
    lenguaje: DataTypes.STRING,
  })
}
