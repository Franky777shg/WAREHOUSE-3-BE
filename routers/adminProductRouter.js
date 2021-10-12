const router = require('express').Router()
const {adminProductController} = require("../controllers")

router.post('/get-product-admin', adminProductController.getAllProdAdmin)

module.exports = router
