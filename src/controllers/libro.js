const { Op } = require('sequelize')

//Importamos los modelos de nuestra base de datos
const { Libro } = require('../conexion/db.js')

//Creamos las funciones del controllador
const getAll = async (req, res, next) => {
  // Posibles parametros
  // filterBy -> 'titulo' | 'autor' | 'price'
  // order --> 'asc' (por defecto) | 'desc'
  // minPrice --> rango de precio minimo
  // maxPrice --> rango de precio maximo

  // Nota: validar las queries y chequear operadores
  const { filterBy, order, minPrice, maxPrice } = req.query

  console.log('params:', filterBy, order, minPrice, maxPrice)

  try {
    // filtrado por rango de precio
    if (filterBy && minPrice && maxPrice) {
      const libros = await Libro.findAll({
        where: {
          precio: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
        order: [['precio', 'ASC']],
      })
      if (!libros.length > 0)
        return res.status(404).json({ msg: 'No se encontraron libros' })
      else return res.status(200).json({ libros })
    }

    // filtrado por titulo o autor
    if (filterBy) {
      // ...
    }

    // todos los libros (sin filtrados)
    const libros = await Libro.findAll()

    if (!libros.length > 0)
      return res.status(404).json({ msg: 'No hay libros' })
    res.status(200).json({ libros })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const libro = await Libro.findByPk(id)
    if (!libro) return res.status(404).json({ msg: 'libro no encontrado' })
    res.status(200).json({ libro })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { titulo, autor, resumen, precio, stock } = req.body
  try {
    if (!titulo) return res.status(400).json({ msg: 'Titulo no provisto' })
    if (!autor) return res.status(400).json({ msg: 'Autor no provisto' })
    if (!resumen) return res.status(400).json({ msg: 'Resumen no provisto' })
    if (!precio) return res.status(400).json({ msg: 'Precio no provisto' })
    if (!stock) return res.status(400).json({ msg: 'Stock no provisto' })

    const libro = await Libro.create(req.body)

    if (!libro)
      return res.status(200).json({ msg: 'No se pudo crear el libro' })

    res.status(201).json({ libro, msg: 'Libro creado' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { libros } = req.body
  try {
    if (!libros) return res.status(400).json({ msg: 'Libros no provistos' })
    const newlibros = await Libro.bulkCreate(libros)
    if (!newlibros.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los libros' })
    res.status(201).json({ libros: newlibros, msg: 'Libros creados' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const oLibro = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!oLibro) return res.status(400).json({ msg: 'Libro no provisto' })
    const libro = await Libro.findByPk(id)
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' })
    const updatedLibro = await libro.update(oLibro)
    if (!updatedLibro)
      return res.status(200).json({ msg: 'No se pudo actualizar el libro' })
    res.status(200).json({ tag: updatedLibro, msg: 'Libro actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    const libro = await Libro.findByPk(id)
    if (!libro) return res.status(404).json({ msg: 'libro no encontrado' })

    const deletelibro = await libro.destroy()
    if (!deletelibro)
      return res.status(200).json({ msg: 'No se pudo eliminar el libro' })

    res.status(200).json({ libro, msg: 'libro eliminado' })
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
