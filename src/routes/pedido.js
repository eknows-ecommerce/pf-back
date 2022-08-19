const { Router } = require('express')

const {
  getAll,
  getById,
  create,
  createBulk,
  updateById,
  deleteById,
  getByUser,
} = require('../controllers/pedido.js')

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.get('/usuario/:usuarioId', getByUser)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:id', updateById)
router.delete('/:id', deleteById)

module.exports = router
