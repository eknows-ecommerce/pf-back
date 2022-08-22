const { Op } = require('sequelize')
const { Tag } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  const { nombre } = req.query
  try {
    const where = nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : null

    const tags = await Tag.findAndCountAll({ where })

    if (!tags.rows.length > 0)
      return res.status(404).json({ msg: 'No hay tags' })

    res.status(200).json({ count: tags.count, tags: tags.rows })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' })
    res.status(200).json({ tag })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { nombre } = req.body
  try {
    if (!nombre) return res.status(400).json({ msg: 'Nombre no provisto' })
    const tag = await Tag.create(req.body)
    if (!tag) return res.status(200).json({ msg: 'No se pudo crear el tag' })
    res.status(201).json({ msg: 'Tag creado', tag })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' })
    const updatedTag = await tag.update({ nombre: nombre || tag.nombre })
    if (!updatedTag)
      return res.status(200).json({ msg: 'No se pudo actualizar el tag' })
    res.status(200).json({ msg: 'Tag actualizado', tag: updatedTag })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' })
    const deleteTag = await tag.destroy()
    if (!deleteTag)
      return res.status(200).json({ msg: 'No se pudo eliminar el tag' })
    res.status(200).json({ msg: 'Tag eliminado', tag })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { tags } = req.body
  try {
    if (!tags.length > 0)
      return res.status(400).json({ msg: 'Tags no provistos' })
    const newTags = await Tag.bulkCreate(tags)
    if (!newTags.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los tags' })
    res.status(201).json({ msg: 'Tags creados', tags: newTags })
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
