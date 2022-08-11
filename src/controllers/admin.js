const { Usuario } = require('../conexion/db')

const axios = require('axios')

// Funcion que valida al usuario que hace una peticion a cualquiera de las rutas
const validarAdministrador = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const auth0Response = await axios.get(
    'https://dev-clppguzk.us.auth0.com/userinfo',
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  )
  const nickname = auth0Response.data.nickname
  const usuario = await Usuario.findOne({
    where: { nickname },
  })

  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

  if (usuario.rol !== 'admin') {
    return res.status(400).json({ msg: 'Usuario no autorizado' })
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)

    const usuarios = await Usuario.findAll()
    if (!usuarios.length)
      return res.status(404).json({ msg: 'Usuarios no encontrados' })

    res.status(200).json({ usuarios })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  const { id } = req.params
  const { datos } = req.body
  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!datos) return res.status(400).json({ msg: 'Datos no provistos' })

    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const updatedUsuario = await usuario.update({
      email: datos.email ?? usuario.email,
      nickname: datos.nickname ?? usuario.nickname,
      platform: datos.platform ?? usuario.platform,
      password: datos.password ?? usuario.password,
      rol: datos.rol ?? usuario.rol,
      telefono: datos.telefono ?? usuario.telefono,
      picture: datos.picture ?? usuario.picture,
      name: datos.name ?? usuario.name,
      pais: datos.pais ?? usuario.pais,
      ciudad: datos.ciudad ?? usuario.ciudad,
    })

    if (!updatedUsuario)
      return res.status(400).json({ msg: 'No se pudo actualizar el usuario' })
    res
      .status(200)
      .json({ usuario: updatedUsuario, msg: 'Usuario actualizado' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  updateUser,
}
