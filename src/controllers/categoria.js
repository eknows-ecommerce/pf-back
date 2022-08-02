require('dotenv').config()
const { Categoria } = require('../conexion/db')
const axios = require('axios')

const getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll()
    categorias.length
      ? res.status(200).json({ categorias })
      : res.status(404).json({ msg: 'Categorias no encontradas' })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params

  try {
    const categoria = await Categoria.findByPk(id)
    categoria
      ? res.status(200).json({ categoria })
      : res.status(404).json({ msg: 'Categoria no encontrada' })
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

    categoria
      ? res.status(200).json({ categoria, msg: 'Categoria creada' })
      : res.status(404).json({ msg: 'No se pudo crear la categoria' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body

  try {
    const categoria = await Categoria.update(name, { where: { id } })
    categoria[0]
      ? res.status(200).json({ msg: 'Categoria actualizada' })
      : res.status(404).json({ msg: 'Categoria no encontrada' })
  } catch (error) {
    next(error)
  }
}

// Solo para desarrollo
const createBulk = async (req, res, next) => {
  const { bulk } = req.body

  try {
    const categorias = await Categoria.bulkCreate(bulk)
    if (categorias) res.status(201).json({ msg: 'Lista de categorias creadas' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCategorias,
  getCategoriaById,
  getCategoriaById,
}
