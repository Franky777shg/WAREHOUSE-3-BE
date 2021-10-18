const userController = require("./userController");
const productController = require("./productController");
const adminController = require("./__admin/adminController");

const transactionController = require("./transactionController");

const adminProductController = require("./__admin/adminProductController");
const superAdminController = require("./__admin/superAdminController");

module.exports = {
  userController,
  productController,
  adminController,
  adminProductController,
  transactionController,
  superAdminController,
};
