const router = require("express").Router();
const { verifyToken } = require("../../helpers/jwt");
const { adminController, superAdminController } = require("../../controllers");

router.post("/auth/login", adminController.adminLogin);
router.post("/auth/keepLogin", verifyToken, adminController.keepLogin);
router.get("/get-warehousedata", superAdminController.getWarehouseData);
router.post("/add-warehousedata", superAdminController.addWarehouse);
router.get("/get-admindata", superAdminController.getDataAdmin);
router.put("/update-warehousedata/:id", superAdminController.updateWarehouse);

module.exports = router;
