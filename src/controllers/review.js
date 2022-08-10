const { Review } = require('../conexion/db.js')

const getAll = async (req, res, next) => {
  try {
    const reviews = await Review.findAll()
    if (!reviews.length > 0)
      return res.status(404).json({ msg: 'No hay reviews' })
    res.status(200).json({ reviews })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const review = await Review.findByPk(id)
    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })
    res.status(200).json({ review })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { titulo, texto, rating, likes } = req.body
  try {
    if (!titulo) return res.status(400).json({ msg: 'Titulo no provisto' })
    if (!texto) return res.status(400).json({ msg: 'Texto no provisto' })
    if (!rating) return res.status(400).json({ msg: 'Rating no provisto' })
    if (!likes) return res.status(400).json({ msg: 'Likes no provisto' })

    const review = await Review.create(req.body)

    if (!review)
      return res.status(200).json({ msg: 'No se pudo crear el review' })

    res.status(201).json({ review, msg: 'Review creado' })
  } catch (error) {
    next(error)
  }
}

const updateById = async (req, res, next) => {
  const { id } = req.params
  const review = req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!review) return res.status(400).json({ msg: 'Review no provisto' })
    const review = await Review.findByPk(id)
    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })
    const updatedReview = await review.update(review)
    if (!updatedReview)
      return res.status(200).json({ msg: 'No se pudo actualizar el review' })
    res.status(200).json({ tag: updatedReview, msg: 'Review actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    const review = await Review.findByPk(id)
    if (!review) return res.status(404).json({ msg: 'Review no encontrado' })

    const deleteReview = await review.destroy()
    if (!deleteReview)
      return res.status(200).json({ msg: 'No se pudo eliminar el review' })

    res.status(200).json({ review, msg: 'Review eliminado' })
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
    res.status(201).json({ reviews: newReviews, msg: 'Reviews creados' })
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
