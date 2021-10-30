const { db } = require("../database");
const { createToken } = require("../helpers/jwt");
const crypto = require("crypto");
const BASE_URL = "https://warehouse-3.purwadhikafs2.com";

module.exports = {
  checkCart: (req, res) => {
    const checkIsCartExist = `SELECT * FROM cart WHERE id_product=${req.body.id_product} AND id_user='${req.user.idUser}' `;
    db.query(checkIsCartExist, (error, checkResult) => {
      if (checkResult.length === 0) {
        res.status(200).send({ message: "cart_empty", data: checkResult });
      } else {
        res.status(200).send({ message: "cart_exist", data: checkResult });
      }
    });
  },
  addToCart: (req, res) => {
    const addToCartQuery = `INSERT INTO cart(id_product, id_user, product_name, product_price, quantity) VALUES(${req.body.id_product}, '${req.user.idUser}', '${req.body.product_name}', ${req.body.product_price}, ${req.body.quantity} )`;
    db.query(addToCartQuery, (error, result) => {
      if (error) res.status(400).send(error);

      res.status(200).send(result);
    });
  },
  addToExistingCart: (req, res) => {
    const addToCartQuery = `UPDATE cart set quantity=${req.body.currentQuantity} WHERE id_user='${req.user.idUser}' AND id_product=${req.body.id_product}`;
    db.query(addToCartQuery, (error, result) => {
      if (error) res.status(400).send(error);
      res.status(200).send(result);
    });
  },

  getCart: (req, res) => {
    const getCartQuery = `SELECT * FROM cart c1 inner join product p1 on c1.id_product = p1.id_product WHERE id_user="${req.user.idUser}" `;
    db.query(getCartQuery, (error, cartResult) => {
      res.status(200).send(cartResult);
    });
  },

  getUserData: (req, res) => {
    const getUserDataQuery = `SELECT full_name, email FROM user WHERE id_user="${req.user.idUser}" `;
    db.query(getUserDataQuery, (error, userDataResult) => {
      res.status(200).send(userDataResult);
    });
  },

  getAddress: (req, res) => {
    const getAddress = `SELECT * FROM address WHERE id_user=${req.user.idUser} `;
    db.query(getAddress, (error, addressResult) => {
      res.status(200).send(addressResult);
    });
  },

  deleteCart: (req, res) => {
    switch (req.params.type) {
      case "partial":
        const deleteCartQuery = `DELETE FROM cart WHERE id_user=${req.user.idUser} AND id_cart=${req.body.cartID} `;
        db.query(deleteCartQuery, (error, deleteRes) => {
          const getCartQuery = `SELECT * FROM cart c1 inner join product p1 on c1.id_product = p1.id_product WHERE id_user="${req.user.idUser}" `;
          db.query(getCartQuery, (error, cartResult) => {
            res.status(200).send(cartResult);
          });
        });
        break;
      case "full":
        const deleteCartQuery2 = `DELETE FROM cart WHERE id_user=${req.user.idUser} `;
        db.query(deleteCartQuery2, (error, deleteRes) => {
          res.status(200).send(deleteRes);
        });
        break;
      default:
        break;
    }
  },

  changeQty: (req, res) => {
    const changeQtyQuery = `UPDATE cart set quantity=${req.body.updateQty} WHERE id_user='${req.user.idUser}' AND id_product=${req.body.id_product}`;
    db.query(changeQtyQuery, (error, changeQtyResult) => {
      const getCartQuery = `SELECT * FROM cart c1 inner join product p1 on c1.id_product = p1.id_product WHERE id_user="${req.user.idUser}" `;
      db.query(getCartQuery, (error, cartResult) => {
        res.status(200).send(cartResult);
      });
    });
  },

  addTransaction: (req, res) => {
    let data = req.body;

    switch (req.params.type) {
      case "order":
        db.query(
          `INSERT INTO warehouse.order(id_user, id_address, order_number, order_date, status, payment_status, complete) VALUES(${req.user.idUser}, ${data.id_address}, '${data.order_number}', '${data.datetime}', 'pending', 'unpaid', 'false' )`,
          (error, resultTransaction) => {
            if (error) res.status(400).send(error);
            res.status(200).send({
              message: "order_added",
              data: resultTransaction,
            });
          }
        );
        break;
      case "detail":
        const addTransactionQuery = `INSERT INTO orderdetail(order_number, id_product, quantity, total_price, shipping_fee)
        VALUES('${data.order_number}', ${data.id_product}, ${data.quantity}, ' ${data.total_price}', '200000' )`;

        db.query(addTransactionQuery, (error, resultTransaction) => {
          if (error) res.status(400).send(error);
          res
            .status(200)
            .send({ message: "transaction_success", data: resultTransaction });
        });
        break;
      case "add_default_payment":
        const addPaymentQuery = `INSERT INTO payment(order_number, payment_method )
        VALUES('${data.order_number}', 'Manual Transfer - ${data.bank}')`;

        db.query(addPaymentQuery, (error, resultTransaction) => {
          if (error) res.status(400).send(error);
          if (resultTransaction) {
            db.query(
              `UPDATE stock set stock_booked=${data.quantity} WHERE id_product=${data.id_product} AND id_warehouse=1`,
              (error2, result2) => {
                res.status(200).send({
                  message: "add_default_payment_success",
                  data: resultTransaction,
                });
              }
            );
          }
        });
        break;
      default:
        break;
    }
  },

  getOrder: (req, res) => {
    db.query(
      `SELECT * FROM warehouse.order o JOIN address a ON o.id_address = a.id_address WHERE o.id_user=${req.user.idUser} AND o.complete='false'`,
      (error, transactionResult) => {
        res.status(200).send(transactionResult);
      }
    );
  },

  getOrderDetail: (req, res) => {
    const getTransactionQuery = `SELECT * FROM warehouse.order o inner join orderdetail od ON o.order_number = od.order_number JOIN address a ON o.id_address = a.id_address JOIN product p ON od.id_product = p.id_product WHERE od.order_number=${db.escape(
      req.body.order_number
    )}`;
    db.query(getTransactionQuery, (error, transactionResult) => {
      res.status(200).send(transactionResult);
    });
  },

  uploadPayment: (req, res) => {
    const data = req.body;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    db.query(
      `UPDATE payment set payment_image='${data.payment_image}', date='${dateTime}', nama_pemilik_rekening='${data.nama}', nominal='${data.nominal}', status='processed' WHERE order_number='${data.order_number}'`,
      (error, transactionResult) => {
        res
          .status(200)
          .send({ message: "update_success", data: transactionResult });
      }
    );
  },

  getPaymentStatus: (req, res) => {
    db.query(
      `SELECT * FROM payment WHERE order_number='${req.body.order_number}'`,
      (error, transactionResult) => {
        res.status(200).send(transactionResult);
      }
    );
  },

  getOrderStatus: (req, res) => {
    db.query(
      `SELECT * FROM warehouse.order WHERE order_number='${req.body.order_number}'`,
      (error, transactionResult) => {
        res.status(200).send(transactionResult);
      }
    );
  },
  orderArrived: (req, res) => {
    db.query(
      `UPDATE warehouse.order set complete='true' WHERE order_number='${req.body.order_number}'`,
      (error, transactionResult) => {
        res.status(200).send({ message: "update_success" });
      }
    );
  },
  getHistory: (req, res) => {
    db.query(
      `SELECT * FROM warehouse.order o JOIN orderdetail od ON o.order_number=od.order_number JOIN product p ON od.id_product=p.id_product WHERE o.id_user=${req.user.idUser} AND o.complete='true';`,
      (error, transactionResult) => {
        res.status(200).send(transactionResult);
      }
    );
  },
};
