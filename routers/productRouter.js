const router = require("express").Router();
const { productController } = require("../controllers");

router.post("/get-product", productController.getAllProd);
router.get("/get-categories", productController.getCategories);
router.post("/filter-product", productController.filteringProduct);
router.post("/sort-product", productController.sortingProduct);
router.get("/detail-product/:idprod", productController.getProductDetail);

module.exports = router;
