const { Router } = require('express')

const {
  getAll,
  getById,
  create,
  createBulk,
  updateById,
  deleteById,
  getAllRemasterizado,
} = require('../controllers/libro.js')

const router = Router()

// router.get('/', getAll)
router.get('/', getAllRemasterizado)
router.get('/:id', getById)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:id', updateById)
router.delete('/:id', deleteById)

module.exports = router
