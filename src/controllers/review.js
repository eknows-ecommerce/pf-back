const { Review, Usuario, Libro, Pedido } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  try {
    const reviews = await Review.findAndCountAll()
    if (!reviews.rows.length > 0)
      return res.status(404).json({ msg: 'No hay reviews' })

    res.status(200).json({ count: reviews.count, reviews: reviews.rows })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { titulo, comentario, rating, LibroId, UsuarioId } = req.body
  try {
    if (!titulo) return res.status(400).json({ msg: 'Titulo no provisto' })
    if (!comentario)
      return res.status(400).json({ msg: 'Comentario no provisto' })
    if (!rating) return res.status(400).json({ msg: 'Rating no provisto' })
    if (!LibroId) return res.status(400).json({ msg: 'Libro Id no provisto' })
    if (!UsuarioId)
      return res.status(400).json({ msg: 'Usuario Id no provisto' })

    const usuario = await Usuario.findByPk(UsuarioId)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    const libro = await Libro.findByPk(LibroId)
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' })

    const pedido = await libro.getDetalleLibro({
      where: { UsuarioId },
    })

    /*const existe = await usuario.hasPedido(pedido)

    if (!existe)
      return res.status(404).json({ msg: 'No hay pedidos para ese usuario' })*/

    const existeReview = await usuario.hasReviewLibro(libro)
    if (existeReview)
      return res.status(404).json({ msg: 'Ya has hecho un comentario' })
    const review = await Review.create({
      titulo,
      comentario,
      rating,
      LibroId,
      UsuarioId,
    })

    if (!review)
      return res.status(200).json({ msg: 'No se pudo crear el review' })

    res.status(201).json({ msg: 'Review creado', review })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { UsuarioId, LibroId } = req.params
  const { titulo, comentario, rating, isVisible } = req.body
  try {
    if (!LibroId)
      return res.status(400).json({ msg: 'Id del libro no provisto' })
    if (!UsuarioId)
      return res.status(400).json({ msg: 'Usuario Id no provisto' })

    const review = await Review.findOne({
      where: { LibroId, UsuarioId },
    })

    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })
    const updatedReview = await review.update({
      titulo: titulo ?? review.titulo,
      comentario: comentario ?? review.comentario,
      rating: rating ?? review.rating,
      isVisible: isVisible ?? review.isVisible,
    })

    if (!updatedReview)
      return res.status(200).json({ msg: 'No se pudo actualizar el review' })
    res.status(200).json({ msg: 'Review actualizado', review: updatedReview })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { UsuarioId, LibroId } = req.params
  try {
    if (!LibroId)
      return res.status(400).json({ msg: 'Id del libro no provisto' })
    if (!UsuarioId)
      return res.status(400).json({ msg: 'Usuario Id no provisto' })

    const review = await Review.findOne({
      where: { LibroId, UsuarioId },
    })
    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })

    const deleteReview = await review.destroy()
    if (!deleteReview)
      return res.status(200).json({ msg: 'No se pudo eliminar el review' })

    res.status(200).json({ msg: 'Review eliminado', review })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { reviews } = req.body
  try {
    if (!reviews) return res.status(400).json({ msg: 'Reviews no provistos' })
    const newReviews = await Review.bulkCreate(reviews)
    if (!newReviews.length > 0)
      return res.status(200).json({ msg: 'No se pudo crear los reviews' })
    res.status(201).json({ msg: 'Reviews creados', reviews: newReviews })
  } catch (error) {
    next(error)
  }
}

const getByLibro = async (req, res, next) => {
  const { LibroId } = req.params
  try {
    if (!LibroId) return res.status(400).json({ msg: 'Libro Id no provisto' })
    const libro = await Libro.findByPk(LibroId, {
      include: {
        attributes: [['name','UsuarioName']],
        model: Usuario,
        as: 'ReviewLibro',
      }
    })
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' })
    //const { ReviewLibro: reviews } = libro
    //const reviews = await Review.findAndCountAll({ where: { LibroId } })
    const count = await libro.countReviewLibro()
    //reviews.map((r)=>({Review}=r))
    if (!count > 0)
      return res.status(404).json({ msg: 'No hay reviews' })
    res.status(200).json({ count, libro })
  } catch (error) {
    next(error)
  }
}

const getByUsuario = async (req, res, next) => {
  const { UsuarioId } = req.params
  try {
    if (!UsuarioId) return res.status(400).json({ msg: 'Id no provisto' })
    const review = await Review.findByPk(UsuarioId)
    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })
    res.status(200).json({ review })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getByUsuario,
  getByLibro,
  create,
  updateById,
  deleteById,
  createBulk,
  getByLibro,
}
