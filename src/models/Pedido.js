const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Pedido', {
    precioTotal: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    direccionEnvio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado'),
      allowNull: false,
    },
    descuento: DataTypes.NUMBER,
    fechaEntraga: DataTypes.DATE,
  })
}
