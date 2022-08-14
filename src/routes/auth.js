const { Usuario } = require('../conexion/db')

const { Router } = require('express')

const axios = require('axios')

const router = Router()

router.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const auth0Response = await axios.get(
      'https://dev-clppguzk.us.auth0.com/userinfo'
    )

    if (auth0Response.status !== 200)
      return res.status(400).json({ msg: 'Error de Auth0', autorizado: false })

    const nickname = auth0Response.data.nickname

    const usuario = await Usuario.findOne({
      where: { nickname, id, rol: 'admin' },
    })

    if (!usuario)
      return res
        .status(400)
        .json({ msg: 'Usuario no autorizado', autorizado: false })

    res.status(200).json({ msg: 'Administrador verificado', autorizado: true })
  } catch (error) {
    next(error)
  }
})

module.exports = router
