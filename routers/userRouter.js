const router = require("express").Router();
const { userController } = require("../controllers");
const { verifyToken, verifyBodyToken } = require("../helpers/jwt");

router.post("/auth/login", userController.userLogin);
router.post("/auth/keepLogin", verifyToken, userController.keepLogin);
router.post("/auth/register", userController.userRegister);
router.post("/check/user", userController.checkIsUserExist);
router.post("/auth/forgot", userController.resetPassword);
router.post("/auth/reset", verifyToken, userController.resetPasswordAction);
router.post(
  "/auth/verification/",
  verifyToken,
  userController.accountVerification
);

module.exports = router;
