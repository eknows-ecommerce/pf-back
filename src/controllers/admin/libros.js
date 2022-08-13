const { Libro } = require('../../conexion/db')

const { validarAdministrador } = require('./adminMiddleware')

/*
  Ejemplo de body en PUT o POST request 

  {
    "datos": {
    "editorial": "Tusquets",
    ...
  }

*/

const updateLibro = async (req, res, next) => {
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

const createLibro = async (req, res, next) => {
  const reqBody = req.body.datos

  try {
    await validarAdministrador(req, res)

    if (!reqBody.titulo)
      return res.status(400).json({ msg: 'Titulo no provisto' })
    if (!reqBody.autor)
      return res.status(400).json({ msg: 'Autor no provisto' })
    if (!reqBody.resumen)
      return res.status(400).json({ msg: 'Resumen no provisto' })
    if (!reqBody.precio)
      return res.status(400).json({ msg: 'Precio no provisto' })
    if (!reqBody.stock)
      return res.status(400).json({ msg: 'Stock no provisto' })

    const libroDuplicado = await Libro.findOne({
      where: {
        titulo: reqBody.titulo,
      },
    })

    if (libroDuplicado) {
      return res.status(200).json({ msg: 'Ya existe un libro con este titulo' })
    }

    const libroCreado = await Libro.create(reqBody)
    if (!libroCreado)
      return res.status(200).json({ msg: 'No se pudo crear el libro' })

    res.status(201).json({ libro: libroCreado, msg: 'Libro creado' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateLibro,
  createLibro,
}
