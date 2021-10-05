const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: (to, subject, body) => {
    const from = "hendrarandomspace@gmail.com";
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: from,
        pass: "Hendrarandom",
      },
    });

    var mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: body,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });
  },
};
