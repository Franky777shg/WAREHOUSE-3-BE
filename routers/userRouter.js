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
router.post('/get-useraddress/',verifyToken, userController.getUserAddress)
router.post('/get-update-user-address/',verifyToken, userController.updateUserAddress)
router.post('/get-add-user-address/',verifyToken, userController.addUserAddress)
router.delete('/get-delete-user-address/:id', userController.deleteUserAddress)
router.post('/get-user/',verifyToken, userController.getDataUser)
router.post('/update-user/',verifyToken, userController.updateUser)

module.exports = router;
