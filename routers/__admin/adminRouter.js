const router = require("express").Router();
const { verifyToken } = require("../../helpers/jwt");
const { adminController, superAdminController, adminWarehouseController } = require("../../controllers");

router.post("/auth/login", adminController.adminLogin);
router.post("/auth/keepLogin", verifyToken, adminController.keepLogin);
router.get("/get-warehousedata", superAdminController.getWarehouseData);
router.post("/add-warehousedata", superAdminController.addWarehouse);
router.get("/get-admindata", superAdminController.getDataAdmin);
router.put("/update-warehousedata/:id", superAdminController.updateWarehouse);
router.get("/get-transactionlist",adminController.getlistTransaction)
router.post("/get-transactionlistdetail",adminController.getlistTransactionDetail)
router.post("/get-updatePayment",adminController.updateStatusPembayaran)

router.post("/filter-transactionlist",adminController.filterTransaction)
router.post("/add-stock-default",superAdminController.addStockDefault)
router.post('/get-wareshousestock', adminWarehouseController.fetchWarehouseStock)
router.post('/req-wareshousestock', adminWarehouseController.sendRequestStock)
router.post('/get-stockrequestlist', adminWarehouseController.fecthStockRequest)
router.post('/get-requestedstock', adminWarehouseController.fecthRequestedStock)
router.post("/update-requestedstock/:id", adminWarehouseController.editRequestedStock);
router.post("/update-requestedlist/:id", adminWarehouseController.editRequestedList);
router.post("/update-reducestock", adminWarehouseController.requestedStockSend);
router.post("/update-increasestock", adminWarehouseController.increaseStockSend);

module.exports = router;
