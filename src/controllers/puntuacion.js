//Importamos los modelos de nuestra base de datos
const { Puntuacion } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  try {
    const puntuaciones = await Puntuacion.findAll()
    if (!puntuaciones.length > 0)
      return res.status(404).json({ msg: 'No hay puntuaciones' })
    res.status(200).json({ puntuaciones })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const puntuacion = await Puntuacion.findByPk(id)
    if (!puntuacion)
      return res.status(404).json({ msg: 'Puntuacion no encontrado' })
    res.status(200).json({ puntuacion })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { valor } = req.body
  try {
    if (!valor) return res.status(400).json({ msg: 'Valor no provisto' })
    const puntuacion = await Puntuacion.create({ valor })
    if (!puntuacion)
      return res.status(200).json({ msg: 'No se pudo crear el puntuacion' })
    res.status(201).json({ puntuacion, msg: 'puntuacion creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { puntuaciones } = req.body
  try {
    if (!puntuaciones.length > 0)
      return res.status(400).json({ msg: 'puntuaciones no provistos' })
    const newpuntuaciones = await Puntuacion.bulkCreate(puntuaciones)
    if (!newpuntuaciones.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los puntuaciones' })
    res
      .status(201)
      .json({ puntuaciones: newpuntuaciones, msg: 'puntuaciones creados' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { valor } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!valor) return res.status(400).json({ msg: 'Valor no provisto' })
    const puntuacion = await Puntuacion.findByPk(id)
    if (!puntuacion)
      return res.status(404).json({ msg: 'puntuacion no encontrado' })
    const updatePuntuacion = await puntuacion.update({ valor })
    if (!updatePuntuacion)
      return res
        .status(200)
        .json({ msg: 'No se pudo actualizar el puntuacion' })
    res
      .status(200)
      .json({ puntuacion: updatePuntuacion, msg: 'puntuacion actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const puntuacion = await Puntuacion.findByPk(id)
    if (!puntuacion)
      return res.status(404).json({ msg: 'puntuacion no encontrado' })
    const deletepuntuacion = await puntuacion.destroy()
    if (!deletepuntuacion)
      return res.status(200).json({ msg: 'No se pudo eliminar el puntuacion' })
    res.status(200).json({ puntuacion, msg: 'puntuacion eliminado' })
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
