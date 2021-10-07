const router = require("express").Router();
const { userController } = require("../controllers");
const { verifyToken } = require("../helpers/jwt");

router.post("/auth/login", userController.userLogin);
router.post("/auth/keepLogin", verifyToken, userController.keepLogin);
router.post("/auth/register", userController.userRegister);
router.get(
  "/auth/verification/:verifEmail",
  userController.accountVerification
);
router.put('/change-password/:id', userController.changePass)

module.exports = router;
