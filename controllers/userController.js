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

    const registerQuery = `INSERT INTO user(username, password, email, full_name, gender, age, profile_picture, status_verified)
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
    const checkQuery = `SELECT * FROM user where email='${req.params.verifEmail}' AND status_verified='pending' `;
    const checkRegisteredAccount = db.query(checkQuery, (error, result) => {
      isUserExist = true;
    });

    if (checkRegisteredAccount) {
      db.query(
        `UPDATE user set status_verified ='active' WHERE email='${req.params.verifEmail}'`,
        (error2, result2) => {
          res.status(200).send({ message: "success", data: result2 });
        }
      );
    }
  },

  changePass: (req, res) => {
    const { password } = req.body
    
    //buat input password jadi hash
    // password = crypto
    // .createHmac("sha1", process.env.SECRET_KEY)
    // .update(password)
    // .digest("hex");

    const updatePass = `update user set password =${db.escape(password)} where id_user=${req.params.id};`

    db.query(updatePass, (errChangePass, resultChangePass) => {
        if (errChangePass) {
            console.log(errChangePass)
            res.status(400).send(errChangePass)
        }

        res.status(200).send(resultChangePass)
    })
}
};
