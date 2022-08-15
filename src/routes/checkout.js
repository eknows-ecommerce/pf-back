const { Router } = require('express')

const { create } = require('../controllers/checkout.js')

const router = Router()

router.post('/', create)

module.exports = router
