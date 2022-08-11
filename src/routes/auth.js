const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const { getByNickname } = require('../controllers/auth.js')

const router = Router()

router.use(jwtCheck)

router.get('/', getByNickname)

module.exports = router
