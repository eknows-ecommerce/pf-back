const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Media', {
    urlImagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urlVideo: DataTypes.STRING,
  })
}
