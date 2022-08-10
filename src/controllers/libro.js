const { Op } = require('sequelize')

const { Libro, Categoria, Tag } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  const {
    titulo = '',
    categorias = '',
    tags = '',
    precioMin = -Infinity,
    precioMax = Infinity,
    orden = 'titulo',
    direcion = 'asc',
    limit = 6,
    offset = 0,
  } = req.query

  try {
    // Busqueda con filtros
    if (categorias || tags || titulo) {
      const whereCategorias = categorias.includes(',')
        ? null
        : categorias
        ? { id: categorias }
        : null

      const whereTags = tags.includes(',') ? null : tags ? { id: tags } : null

      const libros = await Libro.findAndCountAll({
        attributes: [
          'id',
          'titulo',
          'autor',
          'resumen',
          'precio',
          'stock',
          'portada',
        ],
        include: [
          {
            model: Categoria,
            as: 'CategoriaLibro',
            attributes: ['id'],
            where: whereCategorias,
          },
          {
            model: Tag,
            as: 'TagLibro',
            attributes: ['id', 'nombre'],
            where: whereTags,
          },
        ],
        where: {
          titulo: {
            [Op.iLike]: `%${titulo}%`,
          },
          precio: {
            [Op.between]: [precioMin, precioMax],
          },
        },
        distinct: true,
        order: [[`${orden}`, `${direcion}`]],
        limit: categorias.includes(',') ? null : limit,
        offset: categorias.includes(',') ? null : offset * limit,
      })

      //Filtra tanto cuando mandan categorias y tags al mismo tiempo
      if (categorias.includes(',') && tags.includes(',')) {
        const librosEncontrados = libros.rows
          .map((item) => {
            const idsCategorias = item.CategoriaLibro.map((el) => el.id)
              .join(',')
              .includes(categorias)

            const idsTags = item.TagLibro.map((el) => el.id)
              .join(',')
              .includes(tags)

            return idsCategorias === true && idsTags === true && item
          })
          .filter((el) => el)
        //Paginamos los libros encontrados
        const data = librosEncontrados.slice(
          limit * offset,
          limit * (offset + 1)
        )
        //devolvemos la info
        if (data.length === 0)
          return res.status(404).json({ msg: 'No hay libros' })
        return res.status(200).json({
          count: librosEncontrados.length,
          libros: data,
        })
      }

      if (categorias.includes(',')) {
        const arr = libros.rows
          .map((item) => {
            const ids = item.CategoriaLibro.map((el) => el.id)
              .join(',')
              .includes(categorias)
            return ids === true && item
          })
          .filter((el) => el)

        const data = arr.slice(limit * offset, limit * (offset + 1))

        if (data.length === 0)
          return res.status(404).json({ msg: 'No hay libros' })
        return res.status(200).json({
          count: arr.length,
          libros: data,
        })
      }

      if (tags.includes(',')) {
        const arr = libros.rows
          .map((item) => {
            const ids = item.TagLibro.map((el) => el.id)
              .join(',')
              .includes(tags)
            return ids === true && item
          })
          .filter((el) => el)

        const data = arr.slice(limit * offset, limit * (offset + 1))

        if (data.length === 0)
          return res.status(404).json({ msg: 'No hay libros' })
        return res.status(200).json({
          count: arr.length,
          libros: data,
        })
      }

      if (!libros.rows.length)
        return res.status(404).json({ msg: 'No hay libros' })
      return res.status(200).json({ count: libros.count, libros: libros.rows })
    } else {
      // Busqueda sin filtros
      const libros = await Libro.findAndCountAll({
        include: [
          {
            model: Categoria,
            as: 'CategoriaLibro',
          },
          {
            model: Tag,
            as: 'TagLibro',
          },
        ],
        order: [[`${orden}`, `${direcion}`]],
        distinct: true,
        limit: limit,
        offset: offset * limit,
      })

      if (!libros.rows.length)
        return res.status(404).json({ msg: 'No hay libros' })
      return res.status(200).json({ count: libros.count, libros: libros.rows })
    }
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

// Cargar datos a la DB
const createBulk = async (req, res, next) => {
  const { libros, categorias, tags } = req.body

  try {
    if (!libros) return res.status(400).json({ msg: 'Libros no provistos' })
    if (!categorias)
      return res.status(400).json({ msg: 'Categorias no provistos' })
    if (!tags) return res.status(400).json({ msg: 'Tags no provistos' })

    const newlibros = await Libro.bulkCreate(libros, {
      include: ['CategoriaLibro', 'TagLibro'],
    })
    const newCategorias = await Categoria.bulkCreate(categorias)
    const newTags = await Tag.bulkCreate(tags)

    if (
      newlibros.length === 0 ||
      newCategorias.length === 0 ||
      newTags.length === 0
    )
      return res
        .status(200)
        .json({ msg: 'No se pudo crear los libros, categorias y tags' })

    newlibros.forEach((libro) => {
      libros.forEach((bodyLibro) => {
        if (libro.titulo === bodyLibro.titulo) {
          bodyLibro.categorias.forEach((categoria) => {
            libro.addCategoriaLibro(categoria)
          })
          bodyLibro.tags.forEach((tag) => {
            libro.addTagLibro(tag)
          })
        }
      })
    })

    res.status(201).json({
      libros: newlibros,
      categorias: newCategorias,
      tags: newTags,
      msg: 'Libros creados',
    })
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
