const { db } = require("../database");
const { checkData } = require("../helpers/isExist");
const { sendEmail } = require("../helpers/sendMail");
const crypto = require("crypto");

module.exports = {
  userRegister: (req, res) => {
    const userData = req.body;
    let emailBody = `<a href=${process.env.BASE_URL}/user/auth/verification/${userData.email} target='_blank'> click here </a>`;

    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const registerQuery = `INSERT INTO tb_user(username, password, email, full_name, gender, age, profile_picture, status)
    values ('${userData.username}', '${userData.password}', '${userData.email}', '${userData.full_name}', '', '', '', 'pending')`;

    db.query(registerQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      sendEmail(userData.email, "Confirmation", emailBody);
      res.status(200).send({ status: "success", message: result });
    });
  },
};
