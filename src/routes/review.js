// Importamos libreria y funciones del controllador
const { Router } = require('express')

const {
  getAll,
  getById,
  create,
  createBulk,
  updateById,
  deleteById,
} = require('../controllers/review.js')

// rutas
const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:id', updateById)
router.delete('/:id', deleteById)

//exportamos el router
module.exports = router
