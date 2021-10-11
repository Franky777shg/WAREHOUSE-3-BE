const router = require('express').Router()
const {productController} = require("../controllers")

router.post('/get-product', productController.getAllProd)
router.post('/filter-product', productController.filteringProduct)
router.post('/sort-product', productController.sortingProduct)

module.exports = router