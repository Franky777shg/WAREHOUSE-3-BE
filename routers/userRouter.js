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
router.get('/get-useraddress/:id', userController.getUserAddress)
router.post('/get-user/',verifyToken, userController.getDataUser)
router.post('/update-user/',verifyToken, userController.updateUser)

module.exports = router;
