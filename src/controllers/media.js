//Importamos los modelos de nuestra base de datos
const { Media } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  try {
    const medias = await Media.findAll()
    if (!medias.length > 0) return res.status(404).json({ msg: 'No hay contenido aún' })
    res.status(200).json({ medias })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const media = await Media.findByPk(id)
    if (!media) return res.status(404).json({ msg: 'Media no encontrado' })
    res.status(200).json({ media })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { urlImagen, urlVideo } = req.body
  try {
    if (!urlImagen) return res.status(400).json({ msg: 'URL no provista' })
    const media = await Media.create({ urlImagen, urlVideo })
    if (!media) return res.status(200).json({ msg: 'No se pudo crear el contenido' })
    res.status(201).json({ media, msg: 'Contenido creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const {url} = req.body
  try {
    if (!url.length > 0 )
      return res.status(400).json({ msg: 'URL no provista' })
    const newMedia = await Media.bulkCreate(url)
    if (!newMedia.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear el contenido' })
    res.status(201).json({ url: newMedia, msg: 'Contenido creado' })
  } catch (error) {
    next(error)
  }
}

 const updateById = async (req, res, next) => {
  const { id } = req.params
  const { urlImagen, urlVideo } = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!urlImagen) return res.status(400).json({ msg: 'URL no provista' })
    const media = await Media.findByPk(id)
    if (!media) return res.status(404).json({ msg: 'Contenido no encontrado' })
    const updatedMedia = await media.update({ urlImagen, urlVideo })
    if (!updatedMedia)
      return res.status(200).json({ msg: 'No se pudo actualizar el contenido' })
    res.status(200).json({ media: updatedMedia, msg: 'Contenido actualizado' })
  } catch (error) {
    next(error)
  }
} 

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const media = await Media.findByPk(id)
    if (!media) return res.status(404).json({ msg: 'Contenido no encontrado' })
    const deleteMedia = await media.destroy()
    if (!deleteMedia)
      return res.status(200).json({ msg: 'No se pudo eliminar el contenido' })
    res.status(200).json({ media, msg: 'Contenido eliminado' })
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
