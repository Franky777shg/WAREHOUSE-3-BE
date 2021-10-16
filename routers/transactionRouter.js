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

module.exports = router;
