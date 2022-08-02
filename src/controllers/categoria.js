require('dotenv').config()
const { Categoria } = require('../conexion/db')
const axios = require('axios')

const getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll()
    if (!categorias)
      return res.status(404).json({ msg: 'Categorias no encontradas' })
    res.status(200).json({ categorias })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const categoria = await Categoria.findByPk(id)
    if (!categoria)
      return res.status(404).json({ msg: 'Categoria no encontrada' })
    res.status(200).json({ categoria })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { name, miniatura } = req.body
  try {
    if (!name)
      return res.status(400).json({ msg: 'Nombre de categoria no provisto' })
    const categoria = await Categoria.create({ name, miniatura })
    if (!categoria)
      return res.status(404).json({ msg: 'No se pudo crear la categoria' })
    res.status(201).json({ categoria, msg: 'No se pudo crear la categoria' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body
  try {
    if (!id) return res.status(404).json({ msg: 'Id no provisto' })
    const categoria = await Categoria.findByPk(id)
    if (!categoria)
      return res.status(404).json({ msg: 'Categoria no encontrada' })
    const updatedCategoria = await Categoria.update({ name })
    if (!updatedCategoria.length > 0)
      res.status(200).json({ msg: 'No se pudo crear la categoria' })
    res
      .status(200)
      .json({ categoria: updatedCategoria[0], msg: 'Categoria actualizada' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(404).json({ msg: 'Id no provisto' })
    const categoria = await Categoria.findByPk(id)
    if (!categoria) return res.status(404).json({ msg: 'Id no provisto' })
    const deleteCategoria = await Categoria.destroy()
    if (!deleteCategoria)
      return res.status(200).json({ msg: 'Categoria no encotrada' })
    res
      .status(200)
      .json({ categoria: deleteCategoria, msg: 'Categoria eliminada' })
  } catch (error) {
    next(error)
  }
}

// Solo para desarrollo
const createBulk = async (req, res, next) => {
  const { bulk } = req.body
  try {
    if (!bulk)
      return res.status(400).json({ msg: 'Lista de categorias no provistas' })
    const categorias = await Categoria.bulkCreate(bulk)
    if (!categorias.length)
      return res
        .status(200)
        .json({ msg: 'No se pudo crear la lista de categorias' })
    res.status(201).json({ categorias, msg: 'Lista de categorias creadas' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  createBulk,
  deleteById,
}
