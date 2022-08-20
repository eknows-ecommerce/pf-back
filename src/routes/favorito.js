const { Router } = require('express')
const {
  getByUser,
  createByUser,
  deleteByUser,
} = require('../controllers/favorito.js')

const router = Router()

router.get('/usuario/:usuarioId', getByUser)
router.post('/usuario/:usuarioId', createByUser)
router.delete('/usuario/:usuarioId', deleteByUser)

module.exports = router
