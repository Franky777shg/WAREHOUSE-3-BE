const userController = require("./userController");
const productController = require("./productController");
const adminController = require("./__admin/adminController");
const adminProductController = require("./adminProductController");
const transactionController = require("./transactionController");

module.exports = {
  userController,
  productController,
  adminController,
  adminProductController,
  transactionController,
};
