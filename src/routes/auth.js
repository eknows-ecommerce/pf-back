const { Router } = require('express')

const { getByNickname } = require('../controllers/auth.js')

const router = Router()

router.get('/', getByNickname)

module.exports = router
