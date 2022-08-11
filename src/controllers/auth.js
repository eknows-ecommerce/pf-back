const { Usuario } = require('../conexion/db')

const axios = require('axios')

const getByNickname = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const auth0Response = await axios.get(
      'https://nnicolasg.us.auth0.com/userinfo',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    const nickname = auth0Response.data.nickname
    const usuario = await Usuario.findOne({
      where: {
        nickname: nickname,
      },
    })

    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    res.status(200).json({ usuario })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getByNickname,
}

// const accessToken = req.headers.authorization.split(' ')[1]
// const auth0Response = await axios.get('https://nnicolasg.us.auth0.com/userinfo', {
//   headers: {
//     authorization: `Bearer ${accessToken}`,
//   },
// })

// const usuarioData = auth0Response.data

// // buscar usuarion
// // ver si es admin o usuario
