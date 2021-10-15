const userController = require("./userController");
const productController = require("./productController");
const adminController = require("./__admin/adminController");
const adminProductController = require("./adminProductController")
const superAdminController = require("./__admin/superAdminController")
module.exports = {
  userController,
  productController,
  adminController,
  adminProductController,
  superAdminController
};
