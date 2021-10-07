const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/auth/register", userController.userRegister);
router.get(
  "/auth/verification/:verifEmail",
  userController.accountVerification
);
router.put('/change-password/:id', userController.changePass)

module.exports = router;
