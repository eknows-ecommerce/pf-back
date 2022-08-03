//Importaciones de librerias y rutas
const { Router } = require('express')
const tag = require('./tag.js')
const categoria = require('./categoria.js')

//Configuracion de rutas
const router = Router()

// Ejemplo: router.use('/auth', authRouter);
router.use('/categoria', categoria)
router.use('/libro', libro)
router.use('/tag', tag)
// router.use('/media', media)


module.exports = router
