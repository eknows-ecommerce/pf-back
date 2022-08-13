const { Libro } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

const getAllLibros = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)
    const libros = await Libro.findAll()
    if (!libros.length)
      return res.status(404).json({ msg: 'Libros no encontrados' })
    return res.status(200).json({ libros })
  } catch (error) {
    next(error)
  }
}

const updateLibro = async (req, res, next) => {
  /*
    Ejemplo de body en PUT request de /admin/libros/:id

    {
      "datos": {
      "editorial": "Tusquets",
      ...
    }

  */

  const { id } = req.params
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!reqBody) return res.status(400).json({ msg: 'Datos no provistos' })

    const libroEnDb = await Libro.findByPk(id)
    if (!libroEnDb) return res.status(404).json({ msg: 'Libro no encontrado' })

    const updatedLibro = await libroEnDb.update({
      titulo: reqBody.titulo || libroEnDb.titulo,
      autor: reqBody.autor || libroEnDb.autor,
      resumen: reqBody.resumen || libroEnDb.resumen,
      precio: reqBody.precio || libroEnDb.precio,
      isAvail: reqBody.isAvail || libroEnDb.isAvail,
      stock: reqBody.stock || libroEnDb.stock,
      editorial: reqBody.editorial || libroEnDb.editorial,
      fechaPublicacion: reqBody.fechaPublicacion || libroEnDb.fechaPublicacion,
      paginas: reqBody.paginas || libroEnDb.paginas,
      detalles: reqBody.detalles || libroEnDb.detalles,
      lenguaje: reqBody.lenguaje || libroEnDb.lenguaje,
      portada: reqBody.portada || libroEnDb.portada,
    })

    if (!updatedLibro)
      return res.status(400).json({ msg: 'No se pudo actualizar el libro' })
    res.status(200).json({ libro: updatedLibro, msg: 'Libro actualizado' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllLibros,
  updateLibro,
}
