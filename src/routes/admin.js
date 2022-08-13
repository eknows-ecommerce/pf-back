const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const { updateTag, createTag } = require('../controllers/admin/tags.js')
const { updateLibro, createLibro } = require('../controllers/admin/libros')
const { getAllUsers, updateUser } = require('../controllers/admin/usuarios.js')
const {
  updateCategoria,
  createCategoria,
} = require('../controllers/admin/categorias.js')

const router = Router()

router.use(jwtCheck)

router.get('/usuarios', getAllUsers)

router.put('/usuarios/:id', updateUser)
router.put('/libros/:id', updateLibro)
router.put('/categorias/:id', updateCategoria)
router.put('/tags/:id', updateTag)

router.post('/libros', createLibro)
router.post('/tags', createTag)
router.post('/categorias', createCategoria)

// router.post('/tags', createTag)

module.exports = router
