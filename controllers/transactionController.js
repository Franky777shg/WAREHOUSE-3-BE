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
};
