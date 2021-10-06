const nodemailer = require("nodemailer");

const to = "hendraadem@gmail.com";
const subject = "Confirmation";
const body = "Check this out";
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
  text: body,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) throw err;
  console.log("Email sent: " + info.response);
});
