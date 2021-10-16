const router = require('express').Router()
const { adminProductController } = require('../../controllers')

const { uploadProd } = require('../../helpers/multer')
const uploader = uploadProd()

router.post('/get-product-admin', adminProductController.getAllProdAdmin)
router.get('/get-product-admin-detail/:id', adminProductController.getProdAdminDetail)
router.post('/edit-product/:id', adminProductController.editProduct)
router.get('/get-categories', adminProductController.getCategories)
router.get('/get-detail-stock-op/:id', adminProductController.getProdDetailStockOperational)
router.post('/edit-detailfoto/:id', uploader, adminProductController.uploadEditProdDetail)
router.post('/edit-stock/:id', adminProductController.editStock)
router.post('/add-product', adminProductController.addProduct)
router.get('/delete-product/:id/:page/:name', adminProductController.deleteProduct)
module.exports = router
