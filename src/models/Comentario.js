const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Comentario', {
    texto: {
      type: DataTypes.TEXT,
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
