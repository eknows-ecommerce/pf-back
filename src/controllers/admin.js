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
      isBan: datos.isBan ?? usuario.isBan,
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
      titulo: datos.titulo ?? libro.titulo,
      autor: datos.autor ?? libro.autor,
      resumen: datos.resumen ?? libro.resumen,
      precio: datos.precio ?? libro.precio,
      isAvail: datos.isAvail ?? libro.isAvail,
      stock: datos.stock ?? libro.stock,
      editorial: datos.editorial ?? libro.editorial,
      fechaPublicacion: datos.fechaPublicacion ?? libro.fechaPublicacion,
      paginas: datos.paginas ?? libro.paginas,
      detalles: datos.detalles ?? libro.detalles,
      lenguaje: datos.lenguaje ?? libro.lenguaje,
      portada: datos.portada ?? libro.portada,
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
