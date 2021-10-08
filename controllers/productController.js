const { db } = require("../database");

module.exports = {
    getAllProd: (req, res) => {
        //MAKE PAGINATION
        
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per page
        let totalProd
        let countItems = `select count(*) as totalItems from product;` 

        db.query(countItems, (errCountItem, resCountItem) => {
            if(errCountItem) {
                res.status(400).send(errCountItem)
            }
            totalProd = resCountItem[0]

            let getProd = `select * from product limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)}`

            db. query(getProd, (errGetProd, resGetProd) => {
                if(errGetProd) {
                    res.status(400).send(errGetProd)
                }
                let resultProduct = []
                resultProduct.push(resGetProd, {current_page :currentPage}, {per_page :perPage}, totalProd)
                res.status(200).send(resultProduct)
            })
        })
    },

}

