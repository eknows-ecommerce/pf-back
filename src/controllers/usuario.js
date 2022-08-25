const { Op } = require('sequelize')
const { Usuario } = require('../conexion/db')

const { validarUsuario } = require('../middlewares/authMiddleware')

const getAll = async (req, res, next) => {
  const { nickname } = req.query
  try {
    if (nickname) {
      const usuarios = await Usuario.findAndCountAll({
        where: {
          nickname: {
            [Op.iLike]: `%${nickname}%`,
          },
        },
      })
      if (!usuarios.rows.length > 0)
        return res.status(404).json({ msg: 'Usuarios no encontrados' })
      return res
        .status(200)
        .json({ count: usuarios.count, usuarios: usuarios.rows })
    }

    const usuarios = await Usuario.findAndCountAll()
    if (!usuarios.rows.length > 0)
      return res.status(404).json({ msg: 'Usuarios no encontrados' })
    res.status(200).json({ count: usuarios.count, usuarios: usuarios.rows })
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
  const {
    email,
    nickname,
    name,
    password,
    isBan,
    rol,
    telefono,
    picture,
    pais,
    sub,
    ciudad,
  } = req.body
  try {
    // await validarUsuario(req, res)
    if (!email)
      return res.status(400).json({ msg: 'Email de usuario no provisto' })
    if (!nickname)
      return res.status(400).json({ msg: 'Nickname de usuario no provisto' })

    const [usuario, created] = await Usuario.findOrCreate({
      where: {
        email: email,
        nickname: nickname,
      },
      defaults: {
        email,
        name,
        picture,
        nickname,
        platform: sub,
      },
    })

    if (!created)
      return res.status(200).json({ msg: 'Usuario encontrado ', usuario })

    res.status(201).json({ msg: 'Usuario creado', usuario })
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

  console.log(id, req.body)

  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const updatedUsuario = await usuario.update({
      email: email || usuario.email,
      nickname: nickname || usuario.nickname,
      platform: platform || usuario.platform,
      rol: rol || usuario.rol,
      password: password || usuario.password,
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
      .json({ msg: 'Usuario actualizado', usuario: updatedUsuario })
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
    res.status(200).json({ msg: 'Usuario eliminado', usuario })
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

    count = newUsuarios.length
    res.status(201).json({ count, usuarios: newUsuarios })
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
