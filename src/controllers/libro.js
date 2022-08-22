const { Op } = require('sequelize')

const { Libro, Categoria, Tag, Formato } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  const {
    carrito, //array en formato JSON
    search, //barra buscar
    categorias, //array de ids en formato JSON
    tags, //array de ids en formato JSON
    formatos, //array de ids en formato JSON
    precios, //objeto en formato JSON
    orden, //objeto en formato JSON
    limite, //numero
    pagina, //numero -> pagina actual
    buscarPor, // string -> nombre de la columna a buscar
  } = req.query

  //formato JSON
  let categoriasIds = []
  let tagsIds = []
  let formatosIds = []
  let precio = null
  let ordenar = null
  //condiciones para busqueda
  let buscarBy = buscarPor || 'titulo'
  //condiciones para filtrar
  let whereCategorias = {}
  let whereTags = {}
  let whereFormatos = {}
  //condiciones para ordenar
  let order = null
  //condiciones para paginacion
  let limit = limite || Infinity
  let offset = pagina || 1
  //condiciones general
  let where = null

  try {
    //busqueda de solo carrito
    if (carrito) {
      const where = carrito
        ? {
            id: {
              [Op.in]: JSON.parse(carrito),
            },
          }
        : null

      const librosToCar = await Libro.findAll({
        where,
      })
      return res.status(200).json({ librosToCar })
    }

    //condiciones para todos los where
    if (categorias) {
      categoriasIds = JSON.parse(categorias)
      whereCategorias = categorias
        ? {
            id: {
              [Op.in]: categoriasIds,
            },
          }
        : null
    }

    if (tags) {
      tagsIds = JSON.parse(tags)
      whereTags = tags
        ? {
            id: {
              [Op.in]: tagsIds,
            },
          }
        : null
    }

    if (formatos) {
      formatosIds = JSON.parse(formatos)
      whereFormatos = formatos
        ? {
            id: {
              [Op.in]: formatosIds,
            },
          }
        : null
    }

    if (search) {
      where = search
        ? { ...where, [buscarBy]: { [Op.iLike]: `%${search}%` } }
        : null
    }

    if (precios) {
      precio = JSON.parse(precios)
      where = precios
        ? {
            ...where,
            precio: {
              [Op.between]: [precio?.min ?? 0, precio?.max ?? Infinity],
            },
          }
        : null
    }

    if (orden) {
      ordenar = JSON.parse(orden)
      order = orden ? [[ordenar.valor, ordenar.dir]] : null
    }

    //busqueda c/s filtros
    const librosBD = await Libro.findAll({
      include: [
        {
          attributes: ['id', 'nombre', 'miniatura'],
          model: Categoria,
          as: 'CategoriaLibro',
          where: whereCategorias,
          through: { attributes: [] },
        },
        {
          attributes: ['id', 'nombre'],
          model: Tag,
          as: 'TagLibro',
          where: whereTags,
          through: { attributes: [] },
        },
        {
          attributes: ['id', 'nombre'],
          model: Formato,
          as: 'FormatoLibro',
          where: whereFormatos,
          through: { attributes: [] },
        },
      ],
      where,
      order,
    })

    let librosEncontrados = []
    // metodos de array predefinidos
    for (const libro of librosBD) {
      const existe1 = await libro.hasCategoriaLibro(categoriasIds)
      const existe2 = await libro.hasTagLibro(tagsIds)
      const existe3 = await libro.hasFormatoLibro(formatosIds)
      if (existe1 && existe2 && existe3) {
        librosEncontrados.push(libro)
      }
    }
    // metodos para el paginado
    const libros = librosEncontrados.slice(limit * (offset - 1), limit * offset)
    return res.status(200).json({
      count: librosEncontrados.length,
      libros,
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const libro = await Libro.findByPk(id, {
      include: [
        {
          attributes: ['id', 'nombre', 'miniatura'],
          model: Categoria,
          as: 'CategoriaLibro',
          through: { attributes: [] },
        },
        {
          attributes: ['id', 'nombre'],
          model: Tag,
          as: 'TagLibro',
          through: { attributes: [] },
        },
        {
          attributes: ['id', 'nombre'],
          model: Formato,
          as: 'FormatoLibro',
          through: { attributes: [] },
        },
      ],
    })
    if (!libro) return res.status(404).json({ msg: 'libro no encontrado' })
    res.status(200).json({ libro })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { titulo, autor, resumen, precio, stock, categorias, tags, formatos } =
    req.body
  try {
    if (!categorias.length > 0)
      return res.status(400).json({ msg: 'Categorias no provistos' })
    if (!tags.length > 0)
      return res.status(400).json({ msg: 'Tags no provistos' })
    if (!formatos.length > 0)
      return res.status(400).json({ msg: 'Formato no provisto' })
    if (!titulo) return res.status(400).json({ msg: 'Titulo no provisto' })
    if (!autor) return res.status(400).json({ msg: 'Autor no provisto' })
    if (!resumen) return res.status(400).json({ msg: 'Resumen no provisto' })
    if (!precio) return res.status(400).json({ msg: 'Precio no provisto' })
    if (!stock) return res.status(400).json({ msg: 'Stock no provisto' })

    const libro = await Libro.create(req.body)

    if (!libro)
      return res.status(200).json({ msg: 'No se pudo crear el libro' })

    libro.addCategoriaLibro(categorias)
    libro.addTagLibro(tags)
    libro.addFormatoLibro(formatos)

    res.status(201).json({ msg: 'Libro creado', libro })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    const libro = await Libro.findByPk(id, {
      include: [
        {
          attributes: ['id', 'nombre', 'miniatura'],
          model: Categoria,
          as: 'CategoriaLibro',
          through: {
            attributes: [],
          },
        },
        {
          attributes: ['id', 'nombre'],
          model: Tag,
          as: 'TagLibro',
          through: {
            attributes: [],
          },
        },
        {
          attributes: ['id', 'nombre'],
          model: Formato,
          as: 'FormatoLibro',
          through: {
            attributes: [],
          },
        },
      ],
    })
    if (!libro) return res.status(404).json({ msg: 'libro no encontrado' })

    const Formatos = await libro.getFormatoLibro({ joinTableAttributes: [] })
    const Tags = await libro.getTagLibro({ joinTableAttributes: [] })
    const Categorias = await libro.getCategoriaLibro({
      joinTableAttributes: [],
    })

    const libroUpdate = await libro.update({
      titulo: req.body.titulo ?? libro.titulo,
      autor: req.body.autor ?? libro.autor,
      resumen: req.body.resumen ?? libro.resumen,
      precio: req.body.precio ?? libro.precio,
      stock: req.body.stock ?? libro.stock,
      isAvail: req.body.isAvail ?? libro.isAvail,
      editorial: req.body.editorial ?? libro.editorial,
      fechaPublicacion: req.body.fechaPublicacion ?? libro.fechaPublicacion,
      paginas: req.body.paginas ?? libro.paginas,
      lenguaje: req.body.lenguaje ?? libro.lenguaje,
      portada: req.body.portada ?? libro.portada,
    })

    if (!libroUpdate)
      return res.status(200).json({ msg: 'No se pudo actualizar el libro' })

    if (req.body.categorias) libro.removeCategoriaLibro(Categorias)
    if (req.body.tags) libro.removeTagLibro(Tags)
    if (req.body.formatos) libro.removeFormatoLibro(Formatos)

    libro.addCategoriaLibro(req.body.categorias)
    libro.addTagLibro(req.body.tags)
    libro.addFormatoLibro(req.body.formatos)

    res.status(200).json({ msg: 'Libro actualizado', libro: libroUpdate })
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
  const { libros, categorias, tags, formatos } = req.body

  try {
    if (!libros) return res.status(400).json({ msg: 'Libros no provistos' })
    if (!categorias)
      return res.status(400).json({ msg: 'Categorias no provistos' })
    if (!tags) return res.status(400).json({ msg: 'Tags no provistos' })
    if (!formatos) return res.status(400).json({ msg: 'Formatos no provistos' })

    const newlibros = await Libro.bulkCreate(libros, {
      include: ['CategoriaLibro', 'TagLibro'],
    })
    const newCategorias = await Categoria.bulkCreate(categorias)
    const newTags = await Tag.bulkCreate(tags)
    const newFormatos = await Formato.bulkCreate(formatos)

    if (
      newlibros.length === 0 ||
      newCategorias.length === 0 ||
      newTags.length === 0 ||
      newFormatos.length === 0
    )
      return res.status(200).json({
        msg: 'No se pudo crear los libros, categorias, tags y formatos',
      })

    newlibros.forEach((libro) => {
      libros.forEach((bodyLibro) => {
        if (libro.titulo === bodyLibro.titulo) {
          bodyLibro.categorias.forEach((categoria) => {
            libro.addCategoriaLibro(categoria)
          })
          bodyLibro.tags.forEach((tag) => {
            libro.addTagLibro(tag)
          })
          bodyLibro.formatos.forEach((formato) => {
            libro.addFormatoLibro(formato)
          })
        }
      })
    })

    res.status(201).json({
      libros: newlibros,
      categorias: newCategorias,
      tags: newTags,
      formatos: newFormatos,
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
  getAllRemasterizado: getAll,
}
