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
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    fechaPublicacion: DataTypes.DATEONLY,
    fechaEditado: DataTypes.DATEONLY,
    lenguaje: DataTypes.STRING,
  })
}
