//Importaciones de librerias y rutas
const { Router } = require('express')
const tag = require('./tag.js')
const categoria = require('./categoria.js')
const libro = require('./libro.js')
const review = require('./review.js')
const comentario = require('./comentario.js')
const pedido = require('./pedido')
const usuario = require('./usuario')
const formato = require('./formato')
const puntuacion = require('./puntuacion')
//Configuracion de rutas
const router = Router()

// Ejemplo: router.use('/auth', authRouter);
router.use('/categorias', categoria)
router.use('/libros', libro)
router.use('/tags', tag)
router.use('/pedidos', pedido)
router.use('/usuarios', usuario)
router.use('/formatos', formato)
router.use('/puntuaciones', puntuacion)
router.use('/review', review)
router.use('/comentario', comentario)

module.exports = router
