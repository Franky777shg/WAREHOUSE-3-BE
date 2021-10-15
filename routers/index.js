const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const adminRouter = require("./__admin/adminRouter");
const adminProductRouter = require('./__admin/adminProductRouter')

module.exports = {
  userRouter,
  productRouter,
  adminRouter,
  adminProductRouter
};
