const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Libro', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumen: {
      type: DataTypes.STRING(15000),
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isAvail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    editorial: DataTypes.STRING,
    fechaPublicacion: DataTypes.DATE,
    paginas: DataTypes.INTEGER,
    lenguaje: DataTypes.STRING,
    portada: DataTypes.STRING,
  })
}
