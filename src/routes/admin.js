const jwtCheck = require('../middlewares/authMiddleware')

const { Router } = require('express')

const { getAllUsers, updateUser } = require('../controllers/admin.js')

const router = Router()

router.use(jwtCheck)

router.get('/users', getAllUsers)
router.put('/updateUser/:id', updateUser)

module.exports = router
