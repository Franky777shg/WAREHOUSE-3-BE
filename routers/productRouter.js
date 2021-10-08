const router = require('express').Router()
const {productController} = require("../controllers")

router.get('/get-product', productController.getAllProd)

module.exports = router