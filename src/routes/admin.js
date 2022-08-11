const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const {
  getAllUsers,
  updateUser,
  getAllLibros,
  updateLibro,
} = require('../controllers/admin.js')

const router = Router()

router.use(jwtCheck)

router.get('/usuarios', getAllUsers)
router.put('/usuarios/:id', updateUser)
router.get('/libros', getAllLibros)
router.put('/libros/:id', updateLibro)

module.exports = router
