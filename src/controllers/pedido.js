const { Pedido } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  try {
    const pedidos = await Pedido.findAll()
    if (!pedidos.length > 0)
      return res.status(404).json({ msg: 'No hay pedidos' })
    res.status(200).json({ pedidos })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })
    res.status(200).json({ pedido })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { precioTotal, direccionEnvio, estado, descuento, fechaEntrega } =
    req.body
  try {
    if (!precioTotal) return res.status(400).json({ msg: 'Precio no provisto' })
    if (!direccionEnvio)
      return res.status(400).json({ msg: 'Dirección de Envio no provisto' })
    if (!estado) return res.status(400).json({ msg: 'Estado no provisto' })
    const pedido = await Pedido.create({
      precioTotal,
      direccionEnvio,
      estado,
      descuento,
      fechaEntrega,
    })
    if (!pedido)
      return res.status(200).json({ msg: 'No se pudo crear el pedido' })
    res.status(201).json({ pedido, msg: 'Pedido creado' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { precioTotal, direccionEnvio, estado, descuento, fechaEntrega } =
    req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!precioTotal) return res.status(400).json({ msg: 'Precio no provisto' })
    if (!direccionEnvio)
      return res.status(400).json({ msg: 'Dirección de Envio no provisto' })
    if (!estado) return res.status(400).json({ msg: 'Estado no provisto' })
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })
    const updatedPedido = await pedido.update({
      precioTotal,
      direccionEnvio,
      estado,
      descuento,
      fechaEntrega,
    })
    if (!updatedPedido)
      return res.status(200).json({ msg: 'No se pudo actualizar el pedido' })
    res.status(200).json({ pedido: updatedPedido, msg: 'Pedido actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })
    const deletePedido = await pedido.destroy()
    if (!deletePedido)
      return res.status(200).json({ msg: 'No se pudo eliminar el pedido' })
    res.status(200).json({ pedido, msg: 'Pedido eliminado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { pedidos } = req.body
  try {
    if (!pedidos.length > 0)
      return res.status(400).json({ msg: 'Pedidos no provistos' })
    const newPedidos = await Pedido.bulkCreate(pedidos)
    if (!newPedidos.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los pedidos' })
    res.status(201).json({ pedidos: newPedidos, msg: 'Pedidos creados' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  createBulk,
}
