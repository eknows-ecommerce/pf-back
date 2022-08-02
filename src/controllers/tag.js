//Importamos los modelos de nuestra base de datos
const { Tag } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  try {
    const tags = await Tag.findAll()
    tags.length
      ? res.status(200).json({ tags })
      : res.status(404).json({ msg: 'No hay tags' })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(404).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    tag
      ? res.status(200).json({ tag })
      : res.status(404).json({ msg: 'Tag no encontrado' })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { name } = req.body
  try {
    if (!name) return res.status(404).json({ msg: 'Nombre no provisto' })
    const tag = await Tag.create({ name })
    res.status(201).json({ tag }, { msg: 'Tag creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { tags } = req.body
  try {
    if (!tags) return res.status(404).json({ msg: 'Tags no provistos' })
    const newTags = await Tag.bulkCreate(tags)
    res.status(201).json({ tags: newTags, msg: 'Tags creados' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body
  try {
    if (!id) return res.status(404).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' })
    const updatedTag = await tag.update({ name })
    res.status(200).json({ tag: updatedTag[0], msg: 'Tag actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(404).json({ msg: 'Id no provisto' })
    const tag = await Tag.findByPk(id)
    if (!tag) return res.status(404).json({ msg: 'Tag no encontrado' })
    const deleteTag = await tag.destroy()
    res.status(200).json({ tag: deleteTag, msg: 'Tag eliminado' })
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
