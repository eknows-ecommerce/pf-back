const { Formato } = require('../conexion/db.js')

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
  const { nombre } = req.body
  try {
    if (!nombre) return res.status(400).json({ msg: 'Formato no provisto' })
    const [formato, created] = await Formato.findOrCreate({
      where: { nombre },
      defaults: { nombre },
    })
    if (!created)
      return res.status(200).json({ msg: 'El formato ya existe', formato })
    res.status(201).json({ msg: 'Formato creado', formato })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const formato = await Formato.findByPk(id)
    if (!formato) return res.status(404).json({ msg: 'Formato no encontrado' })
    const updatedFormato = await formato.update({
      nombre: nombre || formato.nombre,
    })

    if (!updatedFormato)
      return res.status(200).json({ msg: 'No se pudo actualizar el formato' })
    res
      .status(200)
      .json({ msg: 'Formato actualizado', formato: updatedFormato })
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
    res.status(200).json({ msg: 'Contenido eliminado', formato })
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
    res.status(201).json({ count: newFormatos.length, formatos: newFormatos })
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
