const { Categoria } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

const getAllCategorias = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)
    const categorias = await Categoria.findAll()
    if (!categorias.length)
      return res.status(404).json({ msg: 'Categorias no encontradas' })
    return res.status(200).json({ categorias })
  } catch (error) {
    next(error)
  }
}

const updateCategoria = async (req, res, next) => {
  /*
    Ejemplo de body en PUT request de /admin/categoria/:id

    {
      "datos": {
      "nombre": "Accion",
      "miniatura": "mini.png"
    }

  */

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

module.exports = {
  getAllCategorias,
  updateCategoria,
}
