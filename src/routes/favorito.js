const { Router } = require('express')
const {
  getByUser,
  createByUser,
  deleteByUser,
} = require('../controllers/favorito.js')

const router = Router()

router.get('/:usuarioId', getByUser)
router.post('/', createByUser)
router.delete('/', deleteByUser)

module.exports = router
