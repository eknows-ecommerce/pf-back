const { Op } = require('sequelize')

const { Pedido, Libro, Detalle } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  const { titulo } = req.query
  try {
    let where
    if (titulo) {
      where = {
        titulo: {
          [Op.iLike]: `%${titulo}%`,
        },
      }
    }
    const pedidos = await Pedido.findAndCountAll({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
          where: where ?? null,
        },
      ],
      distinct: true,
    })
    if (!pedidos.rows.length > 0)
      return res.status(404).json({ msg: 'No hay pedidos' })
    res.status(200).json({ count: pedidos.count, pedidos: pedidos.rows })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const pedido = await Pedido.findOne({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
        },
      ],
      where: {
        id,
      },
    })
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })
    res.status(200).json({ pedido })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const {
    direccionEnvio,
    estado,
    descuento,
    fechaEntrega = new Date(),
    libros, 
    UsuarioId//array de objetos con id y cantidad
  } = req.body
  try {
    if (!direccionEnvio)
      return res.status(400).json({ msg: 'Dirección de Envio no provisto' })
    if (!estado) return res.status(400).json({ msg: 'Estado no provisto' })
    if (!libros.length > 0)
      return res.status(400).json({ msg: 'Libros no provistos' })
    const pedido = await Pedido.create({
      direccionEnvio,
      estado,
      descuento,
      fechaEntrega,
      UsuarioId
    })
    if (!pedido)
      return res.status(200).json({ msg: 'No se pudo crear el pedido' })

    if (libros.length > 0) {
      libros.forEach(async ({ id, cantidad }) => {
        const libro = await Libro.findByPk(id)
        pedido.addDetalleLibro(libro, { through: { cantidad } })
      })
    }

    res.status(201).json({ pedido, msg: 'Pedido creado' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { direccionEnvio, estado, descuento, fechaEntrega } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!direccionEnvio)
      return res.status(400).json({ msg: 'Dirección de Envio no provisto' })
    if (!estado) return res.status(400).json({ msg: 'Estado no provisto' })
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })
    const updatedPedido = await pedido.update({
      direccionEnvio,
      estado,
      descuento,
      fechaEntrega,
    })

    if (!updatedPedido)
      return res.status(200).json({ msg: 'No se pudo actualizar el pedido' })
    const pedidoActualizado = await Pedido.findOne({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
        },
      ],
      where: {
        id,
      },
    })
    res
      .status(200)
      .json({ pedido: pedidoActualizado, msg: 'Pedido actualizado' })
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
const getByUser = async (req, res, next) => {
  const { usuarioId } = req.params
  try {
    if (!usuarioId)
      return res.status(400).json({ msg: 'Id usuario no provisto' })
    const pedidos = await Pedido.findAll({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
        },
      ],
      where: {
        UsuarioId: usuarioId,
      },
    })
    if (pedidos.length === 0)
      return res.status(404).json({ msg: 'Pedido no encontrado' })
    res.status(200).json({ pedidos })
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
  getByUser
}
