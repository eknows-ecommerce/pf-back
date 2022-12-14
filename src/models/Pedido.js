const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Pedido', {
    direccionEnvio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado'),
      allowNull: false,
    },
    descuento: DataTypes.FLOAT,
    fechaEntrega: DataTypes.DATE,
  })
}
