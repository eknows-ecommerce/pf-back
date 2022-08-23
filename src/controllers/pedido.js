const { Op } = require('sequelize')

const { Pedido, Libro, Usuario } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  const { titulo } = req.query
  try {
    let where = null
    if (titulo) where = { titulo: { [Op.iLike]: `%${titulo}%` } }

    const pedidos = await Pedido.findAndCountAll({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
          where,
          through: {
            attributes: ['cantidad'],
          },
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
          through: {
            attributes: ['cantidad'],
          },
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


const getByUser = async (req, res, next) => {
  const { usuarioId } = req.params
  try {
    if (!usuarioId)
      return res.status(400).json({ msg: 'Id usuario no provisto' })
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    const pedidos = await usuario.getPedidos({
      include: [
        {
          attributes: ['id', 'titulo', 'precio'],
          model: Libro,
          as: 'DetalleLibro',
          through: {
            attributes: ['cantidad'],
          },
        },
      ],
    })

    const count = await usuario.countPedidos()

    if (!pedidos.length > 0)
      return res
        .status(404)
        .json({ msg: 'No existe pedidos para este usuario' })
    res.status(200).json({ count, pedidos })
  } catch (error) {
    next(error)
  }
}


const create = async (req, res, next) => {
  const {
    direccionEnvio,
    estado,
    libros, //array de objetos con id y cantidad
    UsuarioId,
  } = req.body
  try {
    if (!UsuarioId)
      return res.status(400).json({ msg: 'Id usuario no provisto' })
    if (!direccionEnvio)
      return res.status(400).json({ msg: 'Dirección de Envio no provisto' })
    if (!estado) return res.status(400).json({ msg: 'Estado no provisto' })
    if (!libros.length > 0)
      return res.status(400).json({ msg: 'Libros no provistos' })
    
    const pedido = await Pedido.create(req.body)

    if (!pedido)
      return res.status(200).json({ msg: 'No se pudo crear el pedido' })

    if (libros.length > 0) {
      libros.forEach(async ({ id, cantidad }) => {
        const libro = await Libro.findByPk(id)
        pedido.addDetalleLibro(libro, { through: { cantidad } })
      })
    }

    res.status(201).json({ msg: 'Pedido creado', pedido })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { direccionEnvio, estado, descuento, fechaEntrega } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' })

    const updatedPedido = await pedido.update({
      direccionEnvio: direccionEnvio || pedido.direccionEnvio,
      estado: estado || pedido.estado,
      descuento: descuento || pedido.descuento,
      fechaEntrega: fechaEntrega || pedido.fechaEntrega,
    })

    if (!updatedPedido)
      return res.status(200).json({ msg: 'No se pudo actualizar el pedido' })

    res.status(200).json({ msg: 'Pedido actualizado', pedido: updatedPedido })
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
    res.status(200).json({ msg: 'Pedido eliminado', pedido })
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
    res.status(201).json({ count: newPedidos.length, pedidos: newPedidos })
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
