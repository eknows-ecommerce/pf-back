const { Usuario } = require('../conexion/db')

const getByUser = async (req, res, next) => {
  const { usuarioId } = req.params
  try {
    if (!usuarioId)
      return res.status(400).json({ msg: 'Id de usuario no provisto' })
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const favoritos = await usuario.getFavoritos()
    const count = await usuario.countFavoritos()
    if (!favoritos)
      return res
        .status(404)
        .json({ msg: 'No tiene favoritos', count, favoritos })

    res.status(200).json({ count, favoritos })
  } catch (error) {
    next(error)
  }
}

const createByUser = async (req, res, next) => {
  const { usuarioId, libroId } = req.body
  try {
    if (!usuarioId)
      return res.status(400).json({ msg: 'Id de usuario no provisto' })
    if (!libroId)
      return res.status(400).json({ msg: 'Id de libro no provisto' })
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    const libro = await usuario.hasFavoritos(libroId)
    if (libro)
      return res.status(200).json({ msg: 'Libro ya esta en sus favoritos' })

    await usuario.addFavoritos(libroId)

    const favorito = await usuario.getFavoritos({
      where: { id: libroId },
    })

    res.status(201).json({
      msg: 'Libro agregado a favoritos',
      favorito: favorito[0],
    })
  } catch (error) {
    next(error)
  }
}

const deleteByUser = async (req, res, next) => {
  const { libroId, usuarioId } = req.body
  console.log({ libroId, usuarioId })
  try {
    if (!usuarioId)
      return res.status(400).json({ msg: 'Id de usuario no provisto' })
    if (!libroId)
      return res.status(400).json({ msg: 'Id de libro no provisto' })
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    const libro = await usuario.hasFavoritos(libroId)
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' })

    const favorito = await usuario.getFavoritos({
      where: { id: libroId },
    })

    await usuario.removeFavoritos(libroId)
    res
      .status(200)
      .json({ msg: 'Libro eliminado de favoritos', favorito: favorito[0] })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getByUser,
  createByUser,
  deleteByUser,
}
