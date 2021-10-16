const router = require("express").Router();
const { userController } = require("../controllers");
const { verifyToken } = require("../helpers/jwt");
const { upload } = require("../helpers/multer");
const uploader = upload();

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

router.post("/change-password/", verifyToken, userController.changePass);
router.post("/get-useraddress/", verifyToken, userController.getUserAddress);
router.post(
  "/get-update-user-address/",
  verifyToken,
  userController.updateUserAddress
);
router.post(
  "/get-add-user-address/",
  verifyToken,
  userController.addUserAddress
);
router.delete("/get-delete-user-address/:id", userController.deleteUserAddress);
router.post("/get-user/", verifyToken, userController.getDataUser);
router.post("/update-user/", verifyToken, userController.updateUser);
router.post("/upload-pic/", uploader, verifyToken, userController.uploadPhoto);
router.post("/delete-pic/", verifyToken, userController.deleteUserPhoto);

module.exports = router;
