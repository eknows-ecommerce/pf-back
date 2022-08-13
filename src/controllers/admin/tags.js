const { Tag } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

/*
  Ejemplo de body en PUT o POST request

  {
    "datos": {
    "nombre": "Oriental",
  }

*/

const actualizarTag = async (req, res, next) => {
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

const crearTag = async (req, res, next) => {
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!reqBody.nombre)
      return res.status(400).json({ msg: 'Nombre no provisto' })

    const tagDuplicado = await Tag.findOne({
      where: {
        nombre: reqBody.nombre,
      },
    })

    if (tagDuplicado) {
      return res.status(200).json({ msg: 'Ya existe un tag con este titulo' })
    }

    const tagCreado = await Tag.create(reqBody)
    if (!tagCreado)
      return res.status(200).json({ msg: 'No se pudo crear el tag' })

    res.status(201).json({ tag: tagCreado, msg: 'Tag creado' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  actualizarTag,
  crearTag,
}
