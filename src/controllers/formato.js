//Importamos los modelos de nuestra base de datos
const { Formato } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  try {
    const formatos = await Formato.findAll()
    if (!formatos.length > 0)
      return res.status(404).json({ msg: 'No hay contenido aún' })
    res.status(200).json({ formatos })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const formato = await Formato.findByPk(id)
    if (!formato) return res.status(404).json({ msg: 'Formato no encontrado' })
    res.status(200).json({ formato })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { tipo } = req.body
  try {
    if (!tipo) return res.status(400).json({ msg: 'Tipo no provisto' })
    const formato = await Formato.create({ tipo })
    if (!formato)
      return res.status(200).json({ msg: 'No se pudo crear el tipo' })
    res.status(201).json({ formato, msg: 'Tipo creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { formatos } = req.body
  try {
    if (!formatos.length > 0)
      return res.status(400).json({ msg: 'Formatos no provista' })
    const newFormatos = await Formato.bulkCreate(formatos)
    if (!newFormatos.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los formatos' })
    res.status(201).json({ formatos: newFormatos, msg: 'Formatos creados' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { tipo } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!tipo) return res.status(400).json({ msg: 'Tipo no provista' })
    const formato = await Formato.findByPk(id)
    if (!formato) return res.status(404).json({ msg: 'Tipo no encontrado' })
    const updatedFormato = await formato.update({ tipo })
    if (!updatedFormato)
      return res.status(200).json({ msg: 'No se pudo actualizar el formato' })
    res
      .status(200)
      .json({ formato: updatedFormato, msg: 'Formato actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const formato = await Formato.findByPk(id)
    if (!formato)
      return res.status(404).json({ msg: 'Contenido no encontrado' })
    const deleteFormato = await formato.destroy()
    if (!deleteFormato)
      return res.status(200).json({ msg: 'No se pudo eliminar el contenido' })
    res.status(200).json({ formato, msg: 'Contenido eliminado' })
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
