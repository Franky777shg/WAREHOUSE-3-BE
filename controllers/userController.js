const { db } = require("../database");
const { createToken } = require("../helpers/jwt");
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
        res.status(200).send(result);
      }
    });
  },
  userRegister: (req, res) => {
    const userData = req.body;
    let token = createToken({
      email: userData.email,
    });
    let emailBody = `<a href='${BASE_URL}/auth/verification/${token}' target='_blank'> Click to verif your account </a>`;

    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const registerQuery = `INSERT INTO user(username, password, email, full_name, gender, age, profile_picture, status_verified)
    values ('${userData.username}', '${userData.password}', '${userData.email}', '${userData.name}', '', '', '', 'pending')`;

    db.query(registerQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      sendEmail(userData.email, "Verification", emailBody);
      res.status(200).send({ status: "success", message: userData.email });
    });
  },

  accountVerification: (req, res) => {
    const checkQuery = `SELECT * FROM user where email='${req.user.email}' AND status_verified='pending' `;
    db.query(checkQuery, (error, result) => {
      db.query(
        `UPDATE user set status_verified='active' WHERE email='${req.user.email}'`,
        (error2, result2) => {
          res.status(200).send({ message: "user_activated" });
        }
      );
    });
  },

  checkIsUserExist: (req, res) => {
    const checkQuery = `SELECT * FROM user where email='${req.body.email}' AND status_verified='${req.body.userStatus}' `;
    db.query(checkQuery, (error, result) => {
      if (error) console.log(error);
      if (result.length > 0) res.status(200).send({ message: "user_exist" });
      else res.status(200).send({ message: "user_not_found" });
    });
  },

  resetPassword: (req, res) => {
    let userEmail = req.body.userEmail;
    let token = createToken({
      email: userEmail,
    });

    let emailBody = `<a href='${BASE_URL}/auth/reset/${token}' target='_blank'> Click to reset your password </a>`;
    sendEmail(userEmail, "Password Reset", emailBody);
    res.status(200).send({ message: "email_sent" });
  },

  resetPasswordAction: (req, res) => {
    let userEmail = req.user.email;
    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const getUserDataQuery = `UPDATE user SET password='${req.body.password}' WHERE email='${userEmail}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result) {
        res
          .status(200)
          .send({ status: "success", message: "password_changed" });
      }
    });
  },
};
