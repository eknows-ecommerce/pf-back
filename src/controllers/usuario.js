const { Usuario } = require('../conexion/db')

const { validarUsuario } = require('../middlewares/authMiddleware')

const getAll = async (req, res, next) => {
  const { nickname } = req.query
  try {
    if (nickname) {
      const usuario = await Usuario.findOne({
        where: { nickname },
      })
      if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
      return res.status(200).json({ usuario })
    }

    const usuarios = await Usuario.findAll()
    if (!usuarios.length)
      return res.status(404).json({ msg: 'Usuarios no encontrados' })
    res.status(200).json({ usuarios })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    res.status(200).json({ usuario })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const { email, nickname, name, picture, sub } = req.body
  try {
    await validarUsuario(req, res)

    if (!email)
      return res.status(400).json({ msg: 'Email de usuario no provisto' })

    const usuario = await Usuario.findOrCreate({
      where: {
        email: email,
        nickname: nickname,
      },
      defaults: {
        email: email,
        name: name,
        picture: picture,
        nickname: nickname,
        platform: sub,
      },
    })

    if (!usuario)
      return res.status(400).json({ msg: 'No se pudo crear el usuario' })
    res.status(201).json({ usuario: usuario[0], msg: 'Usuario creado' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const {
    email,
    nickname,
    platform,
    password,
    rol,
    telefono,
    picture,
    name,
    pais,
    ciudad,
    isBan,
  } = req.body

  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!req.body) return res.status(400).json({ msg: 'Datos no provistos' })

    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const updatedUsuario = await usuario.update({
      email: email || usuario.email,
      nickname: nickname || usuario.nickname,
      platform: platform || usuario.platform,
      password: password || usuario.password,
      rol: rol || usuario.rol,
      telefono: telefono || usuario.telefono,
      picture: picture || usuario.picture,
      name: name || usuario.name,
      pais: pais || usuario.pais,
      ciudad: ciudad || usuario.ciudad,
      isBan: isBan || usuario.isBan,
    })

    if (!updatedUsuario)
      return res.status(200).json({ msg: 'No se pudo actualizar el usuario' })
    res
      .status(200)
      .json({ usuario: updatedUsuario, msg: 'Usuario actualizado' })
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encotrado' })
    const deleteUsuario = await usuario.destroy()
    if (!deleteUsuario)
      return res.status(400).json({ msg: 'No se pudo eliminar usuario' })
    res.status(200).json({ usuario, msg: 'Usuario eliminada' })
  } catch (error) {
    next(error)
  }
}

const createBulk = async (req, res, next) => {
  const { usuarios } = req.body
  try {
    if (!usuarios.length > 0)
      return res.status(400).json({ msg: 'Lista de usuarios no provistas' })
    const newUsuarios = await Usuario.bulkCreate(usuarios)
    if (!newUsuarios)
      return res
        .status(400)
        .json({ msg: 'No se pudo crear la lista de usuarios' })
    res
      .status(201)
      .json({ usuarios: newUsuarios, msg: 'Lista de usuarios creadas' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  createBulk,
  deleteById,
}
