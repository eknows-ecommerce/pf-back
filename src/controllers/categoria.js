require('dotenv').config()
const { Categoria } = require('../conexion/db')
const axios = require('axios')

const getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll()
    if (!categorias.length)
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
  const { nombre, miniatura } = req.body
  try {
    if (!nombre)
      return res.status(400).json({ msg: 'Nombre de categoria no provisto' })
    const categoria = await Categoria.create({ nombre, miniatura })
    if (!categoria)
      return res.status(200).json({ msg: 'No se pudo crear la categoria' })
    res.status(201).json({ categoria, msg: 'Categoria creada' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const { nombre, miniatura } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!nombre)
      return res.status(400).json({ msg: 'Nombre de categoria no provisto' })
    const categoria = await Categoria.findByPk(id)
    if (!categoria)
      return res.status(404).json({ msg: 'Categoria no encontrada' })
    const updatedCategoria = await categoria.update({ nombre, miniatura })
    if (!updatedCategoria)
      return res.status(200).json({ msg: 'No se pudo actualizar la categoria' })
    res
      .status(200)
      .json({ categoria: updatedCategoria, msg: 'Categoria actualizada' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const categoria = await Categoria.findByPk(id)
    if (!categoria)
      return res.status(404).json({ msg: 'Categoria no encotrada' })
    const deleteCategoria = await categoria.destroy()
    if (!deleteCategoria)
      return res.status(200).json({ msg: 'No se pudo eliminar categoria' })
    res.status(200).json({ categoria, msg: 'Categoria eliminada' })
  } catch (error) {
    next(error)
  }
}

// Solo para desarrollo
const createBulk = async (req, res, next) => {
  const { categorias } = req.body
  try {
    if (!categorias.length > 0)
      return res.status(400).json({ msg: 'Lista de categorias no provistas' })
    const newCategorias = await Categoria.bulkCreate(categorias)
    if (!newCategorias.length > 0)
      return res
        .status(200)
        .json({ msg: 'No se pudo crear la lista de categorias' })
    res
      .status(201)
      .json({ categorias: newCategorias, msg: 'Lista de categorias creadas' })
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
