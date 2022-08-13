const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const { getAllTags, updateTag } = require('../controllers/admin/tags.js')
const { getAllLibros, updateLibro } = require('../controllers/admin/libros')
const { getAllUsers, updateUser } = require('../controllers/admin/usuarios.js')
const {
  getAllCategorias,
  updateCategoria,
} = require('../controllers/admin/categorias.js')

const router = Router()

router.use(jwtCheck)

router.get('/usuarios', getAllUsers)
router.get('/libros', getAllLibros)
router.get('/categorias', getAllCategorias)
router.get('/tags', getAllTags)

router.put('/usuarios/:id', updateUser)
router.put('/libros/:id', updateLibro)
router.put('/categorias/:id', updateCategoria)
router.put('/tags/:id', updateTag)

module.exports = router
