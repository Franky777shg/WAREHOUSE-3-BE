const userController = require("./userController");
const productController = require("./productController");
const adminController = require("./__admin/adminController");
const adminProductController = require("./__admin/adminProductController")

module.exports = {
  userController,
  productController,
  adminController,
  adminProductController
};
