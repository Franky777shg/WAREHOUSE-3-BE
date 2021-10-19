const { db } = require("../database");
const { createToken } = require("../helpers/jwt");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

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
    const getAddress = `SELECT * FROM address WHERE id_user="${req.user.idUser}" `;
    db.query(getAddress, (error, addressResult) => {
      res.status(200).send(addressResult);
    });
  },

  deleteCart: (req, res) => {
    const deleteCartQuery = `DELETE FROM cart WHERE id_user=${req.user.idUser} AND id_cart=${req.body.cartID} `;
    db.query(deleteCartQuery, (error, deleteRes) => {
      const getCartQuery = `SELECT * FROM cart c1 inner join product p1 on c1.id_product = p1.id_product WHERE id_user="${req.user.idUser}" `;
      db.query(getCartQuery, (error, cartResult) => {
        res.status(200).send(cartResult);
      });
    });
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
    const addTransactionQuery = `INSERT INTO transaction(id_user, id_product, id_address, quantity, total_price, payment_status, payment_image, status) 
    VALUES(${req.user.idUser}, ${data.id_product}, ${data.id_address}, ${data.quantity}, ${data.total_price},   'unpaid', '', 'pending' )`;
    db.query(addTransactionQuery, (error, result) => {
      if (error) res.status(400).send(error);
      res.status(200).send({ message: "transaction_success" });
    });
  },
};
