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

  getlistTransaction: (req, res) => {
    const getTransactionList = `SELECT pay.order_number, pay.date, pay.payment_image, pay.nama_pemilik_rekening, pay.nominal, o.order_date, u.username, o.payment_status
    FROM warehouse.payment pay
      INNER JOIN warehouse.order o
    ON pay.order_number = o.order_number
      INNER JOIN warehouse.user u
    ON u.id_user = o.id_user;`
          db.query(getTransactionList, (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result);
          });
  },

  getlistTransactionDetail: (req, res) => {
    const {order_number} = req.body
    
    const getTransactionList = `SELECT od.id_orderdetail, od.order_number, o.payment_status, 
    o.order_date, od.id_product, od.quantity, p.date, pr.product_name, pr.product_price
      FROM warehouse.payment p
    INNER JOIN warehouse.order o
      on p.order_number = o.order_number
    INNER JOIN warehouse.orderdetail od
      on p.order_number = od.order_number
    INNER JOIN warehouse.product pr
      on pr.id_product = od.id_product
    WHERE od.order_number = '${order_number}';`
          db.query(getTransactionList, (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result);
          });
  },

  updateStatusPembayaran: (req,res) =>{
    const {ordernumber, paymentstatus} = req.body;

    const updatestatus = `UPDATE warehouse.order SET 
    payment_status = '${paymentstatus}'
    WHERE order_number = '${ordernumber}';
    `
    db.query(updatestatus, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      const getTransactionList = `SELECT pay.order_number, pay.date, pay.payment_image, pay.nama_pemilik_rekening, pay.nominal, o.order_date, u.username, o.payment_status
      FROM warehouse.payment pay
        INNER JOIN warehouse.order o
      ON pay.order_number = o.order_number
        INNER JOIN warehouse.user u
      ON u.id_user = o.id_user;`
            db.query(getTransactionList, (err2, result2) => {
              if (err2) {
                console.log(err2);
                res.status(400).send(err2);
              }
              res.status(200).send(result2);
            });
      // res.status(200).send(result);
    });
  },

  filterTransaction:  (req, res) => {
    const {filter} = req.body;
    const filterquerry = ` SELECT pay.order_number, pay.date, pay.payment_image, pay.nama_pemilik_rekening, pay.nominal, o.order_date, u.username, o.payment_status
    FROM warehouse.payment pay
      INNER JOIN warehouse.order o
    ON pay.order_number = o.order_number
      INNER JOIN warehouse.user u
    ON u.id_user = o.id_user
    WHERE pay.order_number LIKE '%${filter}%' OR pay.nama_pemilik LIKE '%${filter} ;`
    // OR address LIKE '%${editData}%' OR kecamatan LIKE '%${editData}%' 
    // OR kabupaten LIKE '%${editData}%'
    // OR total_price LIKE '%${editData}%' OR quantity LIKE '%${editData}%'  OR product_name LIKE '%${editData}%'
    db.query(filterquerry, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result);
    });
  }
};
