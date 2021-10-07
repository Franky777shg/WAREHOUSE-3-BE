const { db } = require("../database");
const { createToken, verifyToken } = require("../helpers/jwt");
const { sendEmail } = require("../helpers/sendMail");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {
  userLogin: (req, res) => {
    const { email, password } = req.body;
    const hashPassword = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const getUserDataQuery = `SELECT * from user WHERE email='${email}' AND password='${hashPassword}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        let token = createToken({
          idUser: result[0].id_user,
        });

        res.status(200).send({ status: "success", data: result[0], token });
      }
    });
  },
  keepLogin: (req, res) => {
    let idUser = req.user.idUser;
    const getUserDataQuery = `SELECT * from user WHERE id_user='${idUser}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
  },
  userRegister: (req, res) => {
    const userData = req.body;
    let emailBody = `<a href='${BASE_URL}/auth/verification/${userData.email}' target='_blank'> Click to verif your account </a>`;

    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const registerQuery = `INSERT INTO user(username, password, email, full_name, gender, age, profile_picture, status)
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
    const checkQuery = `SELECT * FROM user where email='${req.params.verifEmail}' AND status='pending' `;
    const checkRegisteredAccount = db.query(checkQuery, (error, result) => {
      isUserExist = true;
    });

    if (checkRegisteredAccount) {
      db.query(
        `UPDATE user set status='active' WHERE email='${req.params.verifEmail}'`,
        (error2, result2) => {
          res.status(200).send({ message: "success", data: result2 });
        }
      );
    }
  },
};
