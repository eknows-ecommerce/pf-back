const { Categoria } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

/*
  Ejemplo de body en PUT o POST request

  {
    "datos": {
    "nombre": "Accion",
    "miniatura": "mini.png"
  }

*/

const updateCategoria = async (req, res, next) => {
  const { id } = req.params
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!reqBody) return res.status(400).json({ msg: 'Datos no provistos' })

    const categoriaEnDb = await Categoria.findByPk(id)
    if (!categoriaEnDb)
      return res.status(404).json({ msg: 'Categoria no encontrada' })

    const updatedCategoria = await categoriaEnDb.update({
      nombre: reqBody.nombre || categoriaEnDb.nombre,
      miniatura: reqBody.miniatura || categoriaEnDb.miniatura,
    })

    if (!updatedCategoria)
      return res.status(400).json({ msg: 'No se pudo actualizar la categoria' })
    res
      .status(200)
      .json({ categoria: updatedCategoria, msg: 'Categoria actualizada' })
  } catch (error) {
    next(error)
  }
}

const createCategoria = async (req, res, next) => {
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!reqBody.nombre)
      return res.status(400).json({ msg: 'Nombre no provisto' })

    const categoriaDuplicada = await Categoria.findOne({
      where: {
        nombre: reqBody.nombre,
      },
    })

    if (categoriaDuplicada) {
      return res
        .status(200)
        .json({ msg: 'Ya existe una categoria con este titulo' })
    }

    const categoriaCreada = await Categoria.create(reqBody)
    if (!categoriaCreada)
      return res.status(200).json({ msg: 'No se pudo crear la categoria' })

    res
      .status(201)
      .json({ categoria: categoriaCreada, msg: 'Categoria creada' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateCategoria,
  createCategoria,
}
