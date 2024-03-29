const router = require("express").Router();
const { transactionController } = require("../controllers");
const { verifyToken } = require("../helpers/jwt");

router.post("/checkCart", verifyToken, transactionController.checkCart);
router.post("/addToCart", verifyToken, transactionController.addToCart);
router.post(
  "/addToExistingCart",
  verifyToken,
  transactionController.addToExistingCart
);

router.post("/getCart", verifyToken, transactionController.getCart);
router.post("/getAddress", verifyToken, transactionController.getAddress);
router.post("/getUserData", verifyToken, transactionController.getUserData);
router.post("/deleteCart/:type", verifyToken, transactionController.deleteCart);
router.post("/changeQty", verifyToken, transactionController.changeQty);

router.post(
  "/addTransaction/:type",
  verifyToken,
  transactionController.addTransaction
);

router.post("/getOrder", verifyToken, transactionController.getOrder);

router.post(
  "/getOrderDetail",
  verifyToken,
  transactionController.getOrderDetail
);

router.post("/getPaymentStatus", transactionController.getPaymentStatus);
router.post("/getOrderStatus", transactionController.getOrderStatus);
router.post("/uploadPayment", transactionController.uploadPayment);
router.post("/orderArrived", transactionController.orderArrived);

router.post("/getHistory", verifyToken, transactionController.getHistory);

module.exports = router;
