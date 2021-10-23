const router = require('express').Router()
const { adminProductController } = require('../../controllers')

const { uploadProd } = require('../../helpers/multer')
const uploader = uploadProd()

router.post('/get-product-admin', adminProductController.getAllProdAdmin)
router.get('/get-product-admin-detail/:id', adminProductController.getProdAdminDetail)
router.get('/get-categories', adminProductController.getCategories)
router.get('/get-detail-stock-op/:id', adminProductController.getProdDetailStockOperational)

router.post('/edit-product/:id', adminProductController.editProduct)
router.post('/edit-detailfoto/:id', uploader, adminProductController.uploadEditProdDetail)
router.post('/edit-stock/:id', adminProductController.editStock)

router.post('/add-product', adminProductController.addProduct)
router.post('/add-stock-default/:id', adminProductController.addStockDefault)
router.get('/delete-product/:id/:page/:name', adminProductController.deleteProduct)
router.post('/delete-stock/:id', adminProductController.deleteStock)

router.get('/product-report', adminProductController.prodReport)
router.post('/product-sales-report', adminProductController.prodSalesReport)

router.get('/product-revenue', adminProductController.prodRevenue)
router.get('/product-revenue-total', adminProductController.prodRevenueTotal)
router.post('/product-revenue-date', adminProductController.prodRevenueDates)

module.exports = router
