const { db } = require("../../database");
const { createToken } = require("../../helpers/jwt");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {

    fetchWarehouseStock : (req,res) => {
        const editData = req.body

        let fecthwarehousestock = `select p.id_product, p.product_name, s.stock_op, w.warehouse_name,  w.id_warehouse from stock s 
        inner join warehouse w 
        on w.id_warehouse = s.id_warehouse
        inner join product p
        on p.id_product = s.id_product
        where s.id_warehouse= '${editData.id_warehouse}' ;`
        db.query(fecthwarehousestock, (err, result) => {
            if(err) {
                console.log(err)
                res.status(400).send(err)
            }
            res.status(200).send(result)
        })  

    },

    sendRequestStock : (req,res) => {

        const editData = req.body

        let sendRequestStock = `INSERT INTO stock_reservation (id_product, id_warehouse_origin, warehouse_name_origin,
        id_warehouse_target, quantity, status)
        VALUES ('${editData.id_product}', '${editData.id_warehouse_origin}', '${editData.warehouse_name_origin}',
        '${editData.id_warehouse_target}','${editData.quantity}', '${editData.status}')`
        db.query(sendRequestStock, (err, result) => {
            if(err) {
                console.log(err)
                res.status(400).send(err)
            }
            res.status(200).send(result)
        }) 
    },

    fecthStockRequest : (req,res) => {
        const editData = req.body

        let fecthStockRequestData = `SELECT sr.id_product, sr.id_warehouse_origin, sr.warehouse_name_origin,
        sr.id_warehouse_target, sr.quantity, sr.status, p.product_name
        FROM stock_reservation sr 
        INNER JOIN product p
        on sr.id_product = p.id_product
        WHERE id_warehouse_origin = '${editData.id_warehouse_origin}' ;`
        db.query(fecthStockRequestData, (err, result) => {
            if(err) {
                console.log(err)
                res.status(400).send(err)
            }
            res.status(200).send(result)
        })  

    },

    fecthRequestedStock : (req,res) => {
        const editData = req.body

        let fecthRequestedStockData = `SELECT sr.id_product, sr.id_warehouse_origin, sr.warehouse_name_origin, 
        sr.id_warehouse_target, sr.quantity, sr.status, p.product_name
        FROM stock_reservation sr 
        INNER JOIN product p
        on sr.id_product = p.id_product
        WHERE id_warehouse_target = '${editData.id_warehouse_target}' ;`
        db.query(fecthRequestedStockData, (err, result) => {
            if(err) {
                console.log(err)
                res.status(400).send(err)
            }
            res.status(200).send(result)
        })  

    },
}

