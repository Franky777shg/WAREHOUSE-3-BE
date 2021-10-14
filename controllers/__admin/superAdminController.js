const { db } = require("../../database");
const { createToken } = require("../../helpers/jwt");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {

  getWarehouseData : (req,res) => {
    // let getWarehouseData = `SELECT warehouse_name,warehouse_address,warehouse_kecamatan,warehouse_kabupaten,warehouse_provinsi
    // FROM warehouse`    
    let getWarehouseData = `SELECT id_warehouse, warehouse_name,warehouse_address,warehouse_kecamatan,warehouse_kabupaten,warehouse_provinsi,admin_name
    FROM warehouse w
    INNER JOIN admin a
    ON w.id_admin = a.id_admin`    
    db.query(getWarehouseData, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })  
  },

  addWarehouse : (req,res) => {
    const editData = req.body
    const addWarehouse = `INSERT INTO warehouse(warehouse_name, warehouse_address, warehouse_kecamatan, warehouse_kabupaten,
        warehouse_provinsi, id_admin)
    VALUES 
    ('${editData.warehouse_name}', '${editData.warehouse_address}', '${editData.warehouse_kecamatan}',
    '${editData.warehouse_kabupaten}','${editData.warehouse_provinsi}','${editData.id_admin}')`;

    db.query(addWarehouse, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
            let getWarehouse = `SELECT warehouse_name,warehouse_address,warehouse_kecamatan,warehouse_kabupaten,warehouse_provinsi
            FROM warehouse`    
            db.query(getWarehouse, (err2, result2) => {
                if(err) {
                    console.log(err)
                    res.status(400).send(err2)
                }
            res.status(200).send(result2)
        })
    // res.status(200).send(result)
    })
  },

  getDataAdmin : (req,res) => {
    let getWarehouseData = `SELECT *
    FROM admin`    
    db.query(getWarehouseData, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })  
  },

  updateWarehouse : (req,res) => {
    const editData = req.body
    let idWarehouse = req.params.id;

    const updateWarehouse =`UPDATE  warehouse SET 
    warehouse_name      = '${editData.warehouse_name}', 
    warehouse_address   = '${editData.warehouse_address}', 
    warehouse_kecamatan = '${editData.warehouse_kecamatan}', 
    warehouse_kabupaten = '${editData.warehouse_kabupaten}',
    warehouse_provinsi  = '${editData.warehouse_provinsi}', 
    id_admin = '${editData.id_admin}'
    WHERE id_warehouse = '${idWarehouse}'`;

    db.query(updateWarehouse, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
            let getWarehouse = `SELECT warehouse_name,warehouse_address,warehouse_kecamatan,warehouse_kabupaten,warehouse_provinsi
            FROM warehouse`    
            db.query(getWarehouse, (err2, result2) => {
                if(err) {
                    console.log(err)
                    res.status(400).send(err2)
                }
            res.status(200).send(result2)
        })
    // res.status(200).send(result)
    }) 
  }


};
