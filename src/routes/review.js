const { Router } = require('express')

const {
  getAll,
  getByUsuario,
  create,
  createBulk,
  updateById,
  deleteById,
  getByLibro,
} = require('../controllers/review.js')

const router = Router()

router.get('/', getAll)
router.get('/libro/:LibroId', getByLibro)
router.get('/usuario/:UsuarioId', getByUsuario)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:UsuarioId/:LibroId', updateById)
router.delete('/:UsuarioId/:LibroId', deleteById)

module.exports = router
