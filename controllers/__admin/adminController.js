const { db } = require("../../database");
const { createToken } = require("../../helpers/jwt");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {
  adminLogin: (req, res) => {
    const { email, password } = req.body;

    const hashPassword = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const getUserDataQuery = `SELECT * from admin WHERE email='${email}' AND password='${password}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        let token = createToken({
          idAdmin: result[0].id_admin,
        });

        res.status(200).send({ status: "success", data: result[0], token });
      }
    });
  },

  keepLogin: (req, res) => {
    let idAdmin = req.user.idAdmin;
    const getAdminDataQuery = `SELECT * from admin WHERE id_admin='${idAdmin}'`;
    db.query(getAdminDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        res.status(200).send({ status: "success", data: result[0] });
      }
    });
  },
};
