const router = require("express").Router();
const { verifyToken } = require("../../helpers/jwt");
const { adminController } = require("../../controllers");

router.post("/auth/login", adminController.adminLogin);
router.post("/auth/keepLogin", verifyToken, adminController.keepLogin);
router.get("/get-warehousedata", adminController.getWarehouseData);
router.post("/add-warehousedata", adminController.addWarehouse);

module.exports = router;
