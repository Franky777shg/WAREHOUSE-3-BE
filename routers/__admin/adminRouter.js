const router = require("express").Router();
const { verifyToken } = require("../../helpers/jwt");
const { adminController } = require("../../controllers");

router.post("/auth/login", adminController.adminLogin);
router.post("/auth/keepLogin", verifyToken, adminController.keepLogin);

module.exports = router;
