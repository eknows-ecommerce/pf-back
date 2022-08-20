const { Usuario } = require('../conexion/db')

const axios = require('axios')

const validarUsuario = async (req, res, next) => {
  const { authorization } = req.headers
  try {
    if (!authorization)
      return res.status(401).json({ msg: 'No se encontró la autorización' })
    const token = req.headers.authorization.split(' ')[1]

    const auth0Response = await axios.get(
      'https://dev-clppguzk.us.auth0.com/userinfo',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    if (auth0Response.status !== 200)
      return res.status(498).json({ msg: 'Token expirado o invalido' })

    const nickname = auth0Response.data.nickname

    const usuario = await Usuario.findOne({
      where: { nickname },
    })

    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
  } catch (error) {
    next(error)
  }
}

exports.validarUsuario = validarUsuario
