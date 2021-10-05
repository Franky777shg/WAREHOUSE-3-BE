const { db } = require("../database");

module.exports = {
  checkData: (type, payload) => {
    let sqlQuery;
    switch (type) {
      case "email":
        sqlQuery = `SELECT * FROM tb_user WHERE email='${payload}'`;
        break;
      case "username":
        sqlQuery = `SELECT * FROM tb_user WHERE email='${payload}'`;
        break;
    }

    db.query(sqlQuery, (err, res) => {
      if (err) {
        return false;
      }
      return res;
    });
  },
};
