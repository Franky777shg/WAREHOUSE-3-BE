const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/auth/register", userController.userRegister);
router.get("/auth/verification/:email", userController.accountVerification);

module.exports = router;
