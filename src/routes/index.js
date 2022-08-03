//Importaciones de librerias y rutas
const { Router } = require('express')
const tag = require('./tag.js')
const categoria = require('./categoria.js')
const libro = require('./libro.js')
const pedido = require('./pedido')
const usuario = require('./usuario')
const media = require('./media')

//Configuracion de rutas
const router = Router()

// Ejemplo: router.use('/auth', authRouter);
router.use('/categoria', categoria)
router.use('/libro', libro)
router.use('/tag', tag)
router.use('/pedido', pedido)
router.use('/usuario', usuario)
router.use('/media', media)

module.exports = router
