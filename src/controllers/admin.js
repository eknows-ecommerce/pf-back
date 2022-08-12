const { Usuario, Libro } = require('../conexion/db')

const axios = require('axios')

// Funcion auxiliar que valida al usuario que hace una peticion a cualquiera de las rutas
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

// Ver todos los usuarios siendo admin
const getAllUsers = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)

    const usuarios = await Usuario.findAll()
    if (!usuarios.length)
      return res.status(404).json({ msg: 'Usuarios no encontrados' })

    return res.status(200).json({ usuarios })
  } catch (error) {
    next(error)
  }
}

// Editar datos de usuario siendo admin
const updateUser = async (req, res, next) => {
  const { id } = req.params
  const datos = req.body
  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!datos) return res.status(400).json({ msg: 'Datos no provistos' })

    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const updatedUsuario = await usuario.update({
      email: req.body.datos.email ?? usuario.email,
      nickname: req.body.datos.nickname ?? usuario.nickname,
      platform: req.body.datos.platform ?? usuario.platform,
      password: req.body.datos.password ?? usuario.password,
      rol: req.body.datos.rol ?? usuario.rol,
      telefono: req.body.datos.telefono ?? usuario.telefono,
      picture: req.body.datos.picture ?? usuario.picture,
      name: req.body.datos.name ?? usuario.name,
      pais: req.body.datos.pais ?? usuario.pais,
      ciudad: req.body.datos.ciudad ?? usuario.ciudad,
      isBan: req.body.datos.isBan ?? usuario.isBan,
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

const getAllLibros = async (req, res, next) => {
  try {
    await validarAdministrador(req, res)

    const libros = await Libro.findAll()
    if (!libros.length)
      return res.status(404).json({ msg: 'Libros no encontrados' })

    return res.status(200).json({ libros })
  } catch (error) {
    next(error)
  }
}

const updateLibro = async (req, res, next) => {
  const { id } = req.params
  const datos = req.body

  try {
    await validarAdministrador(req, res)

    if (!id) return res.status(400).json({ msg: 'Id no provisto' })

    if (!datos) return res.status(400).json({ msg: 'Datos no provistos' })

    const libro = await Libro.findByPk(id)
    if (!libro) return res.status(404).json({ msg: 'Libro no encontrado' })

    const updateLibro = await libro.update({
      titulo: req.body.datos.titulo ?? libro.titulo,
      autor: req.body.datos.autor ?? libro.autor,
      resumen: req.body.datos.resumen ?? libro.resumen,
      precio: req.body.datos.precio ?? libro.precio,
      isAvail: req.body.datos.isAvail ?? libro.isAvail,
      stock: req.body.datos.stock ?? libro.stock,
      editorial: req.body.datos.editorial ?? libro.editorial,
      fechaPublicacion:
        req.body.datos.fechaPublicacion ?? libro.fechaPublicacion,
      paginas: req.body.datos.paginas ?? libro.paginas,
      detalles: req.body.datos.detalles ?? libro.detalles,
      lenguaje: req.body.datos.lenguaje ?? libro.lenguaje,
      portada: req.body.datos.portada ?? libro.portada,
    })

    if (!updateLibro)
      return res.status(400).json({ msg: 'No se pudo actualizar el libro' })
    res.status(200).json({ usuario: updateLibro, msg: 'Libro actualizado' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  updateUser,
  getAllLibros,
  updateLibro,
}
