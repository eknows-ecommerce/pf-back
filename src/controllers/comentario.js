//Importamos los modelos de nuestra base de datos
const { Comentario } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  try {
    const comentarios = await Comentario.findAll()
    if (!comentarios.length > 0)
      return res.status(404).json({ msg: 'No hay comentarios' })
    res.status(200).json({ comentarios })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const comentario = await Comentario.findByPk(id)
    if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' })
    res.status(200).json({ comentario })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const comment= req.body
  try {
    if (!comment.texto) return res.status(400).json({ msg: 'Texto no provisto' })
    if (!comment.likes) return res.status(400).json({ msg: 'Likes no provisto' })
    comment.fechaPublicacion=new Date().toLocaleDateString().replace('/','-')
    const comentario = await Comentario.create(req.body)

    if (!comentario)
      return res.status(200).json({ msg: 'No se pudo crear el comentario' })

    res.status(201).json({ comentario, msg: 'Comentario creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { comentarios } = req.body
  try {
    if (!comentarios) return res.status(400).json({ msg: 'Comentarios no provistos' })
    const newComentarios = await Comentario.bulkCreate(comentarios)
    if (!newComentarios.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los comentarios' })
    res.status(201).json({ comentarios: newComentarios, msg: 'Comentarios creados' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const comentario = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!comentario) return res.status(400).json({ msg: 'Comentario no provisto' })
    const comentario = await Comentario.findByPk(id)
    if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' })
    const updatedComment = await comentario.update(comentario)
    if (!updatedComment)
      return res.status(200).json({ msg: 'No se pudo actualizar el comentario' })
    updatedComment.edited=true
    updatedComment.fechaEditado= new Date().toLocaleDateString().replace('/','-')
    res.status(200).json({ tag: updatedComment, msg: 'Comentario actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    const comentario = await Comentario.findByPk(id)
    if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' })

    const deleteComment = await comentario.destroy()
    if (!deleteComment)
      return res.status(200).json({ msg: 'No se pudo eliminar el comentario' })

    res.status(200).json({ comentario, msg: 'Comentario eliminado' })
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
