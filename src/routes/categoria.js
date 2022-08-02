const { Router } = require('express')
const {
  getAll,
  getById,
  create,
  createBulk,
  update,
} = require('../controllers/recipeController')

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:id', update)

module.exports = router
