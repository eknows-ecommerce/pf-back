const { Router } = require('express')
const {
  getAll,
  getById,
  create,
  createBulk,
  update,
  deleteById,
  getByNickname,
} = require('../controllers/usuario.js')

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', create)
router.post('/bulk', createBulk)
router.put('/:id', update)
router.delete('/:id', deleteById)

module.exports = router
