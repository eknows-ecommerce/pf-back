const { Tag } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

const getAllTags = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)
    const tags = await Tag.findAll()
    if (!tags.length)
      return res.status(404).json({ msg: 'Tags no encontrados' })
    return res.status(200).json({ tags })
  } catch (error) {
    next(error)
  }
}

const updateTag = async (req, res, next) => {
  /*
    Ejemplo de body en PUT request de /admin/tag/:id

    {
      "datos": {
      "nombre": "Oriental",
    }

  */

  const { id } = req.params
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!reqBody) return res.status(400).json({ msg: 'Datos no provistos' })

    const tagEnDb = await Tag.findByPk(id)
    if (!tagEnDb) return res.status(404).json({ msg: 'Tag no encontrado' })

    const updatedTag = await tagEnDb.update({
      nombre: reqBody.nombre || tagEnDb.nombre,
    })

    if (!updatedTag)
      return res.status(400).json({ msg: 'No se pudo actualizar el tag' })
    res.status(200).json({ tag: updatedTag, msg: 'Tag actualizada' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTags,
  updateTag,
}
