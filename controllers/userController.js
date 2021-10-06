const { db } = require("../database");
const { checkData } = require("../helpers/isExist");
const { sendEmail } = require("../helpers/sendMail");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {
  userRegister: (req, res) => {
    const userData = req.body;
    let emailBody = `<a href='${BASE_URL}/auth/verification/${userData.email}' target='_blank'> Click to verif your account </a>`;

    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const registerQuery = `INSERT INTO tb_user(username, password, email, full_name, gender, age, profile_picture, status)
    values ('${userData.username}', '${userData.password}', '${userData.email}', '${userData.name}', '', '', '', 'pending')`;

    db.query(registerQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      sendEmail(userData.email, "Confirmation", emailBody);
      res.status(200).send({ status: "success", message: userData.email });
    });
  },

  accountVerification: (req, res) => {
    let isUserExist = false;
    const checkQuery = `SELECT * FROM tb_user where email='${req.params.verifEmail}' AND status='pending' `;
    const checkRegisteredAccount = db.query(checkQuery, (error, result) => {
      isUserExist = true;
    });

    if (checkRegisteredAccount) {
      db.query(
        `UPDATE tb_user set status='active' WHERE email='${req.params.verifEmail}'`,
        (error2, result2) => {
          res.status(200).send({ message: "success", data: result2 });
        }
      );
    }
  },
};
