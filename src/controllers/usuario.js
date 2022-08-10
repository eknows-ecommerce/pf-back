require('dotenv').config()
const { Usuario } = require('../conexion/db')
const axios = require('axios')

const getAll = async (req, res, next) => {
  try {
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
  
  const { email, contraseña, rol, telefono, name, pais, ciudad, picture } =
    req.body
    console.log("CREATE", email, name);
  
  try {
    if (!email)
      return res.status(400).json({ msg: 'Email de usuario no provisto' })
    /* else if (!contraseña)
      return res.status(400).json({ msg: 'Contraseña de usuario no provista' }) */
   /*  else if (!rol)
      return res.status(400).json({ msg: 'Rol de usuario no provisto' }) */
    const usuario = await Usuario.findOrCreate({
      where: {
        email: email,
    },
  defaults:{
    email: email,
    name: name,
    picture: picture,
  }})
    
    if (!usuario)
      return res.status(200).json({ msg: 'No se pudo crear el usuario' })
    res.status(201).json({ usuario, msg: 'Usuario creada' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const { email, contraseña, rol, telefono, nombreCompleto, pais, ciudad } =
    req.body
  try {
    if (!id) return res.status(400).json({ msg: 'Id no provisto' })
    if (!email)
      return res.status(400).json({ msg: 'Email de usuario no provisto' })
    else if (!contraseña)
      return res.status(400).json({ msg: 'Contraseña de usuario no provista' })
    else if (!rol)
      return res.status(400).json({ msg: 'Rol de usuario no provisto' })
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' })
    const updatedUsuario = await usuario.update({
      email,
      contraseña,
      rol,
      telefono,
      nombreCompleto,
      pais,
      ciudad,
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

// Solo para desarrollo
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
