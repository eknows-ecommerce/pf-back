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

router.get('/users', getAllUsers)
router.put('/updateUser/:id', updateUser)
router.get('/libros', getAllLibros)
router.put('/updateLibros/:id', updateLibro)

module.exports = router
