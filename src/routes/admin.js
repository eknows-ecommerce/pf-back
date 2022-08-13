const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const { actualizarTag, crearTag } = require('../controllers/admin/tags.js')

const { actualizarLibro, crearLibro } = require('../controllers/admin/libros')

const {
  todosLosUsuarios,
  actualizarUsuario,
} = require('../controllers/admin/usuarios.js')

const {
  actualizarCategoria,
  crearCategoria,
} = require('../controllers/admin/categorias.js')

const router = Router()

router.use(jwtCheck)

router.get('/usuarios', todosLosUsuarios)

router.put('/usuarios/:id', actualizarUsuario)
router.put('/libros/:id', actualizarLibro)
router.put('/categorias/:id', actualizarCategoria)
router.put('/tags/:id', actualizarTag)

router.post('/libros', crearLibro)
router.post('/tags', crearTag)
router.post('/categorias', crearCategoria)

module.exports = router
