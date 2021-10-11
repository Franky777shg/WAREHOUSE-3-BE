const { db } = require("../database");

module.exports = {
    getAllProd: (req, res) => {
        //MAKE PAGINATION
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per page
        let totalProd
        let countItems = `select count(*) as totalItems from product;`

        db.query(countItems, (errCountItem, resCountItem) => {
            if (errCountItem) {
                res.status(400).send(errCountItem)
            }
            totalProd = resCountItem[0]

            let getProd = `select * from product limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)}`

            db.query(getProd, (errGetProd, resGetProd) => {
                if (errGetProd) {
                    res.status(400).send(errGetProd)
                }
                let resultProduct = []
                resultProduct.push(resGetProd, { current_page: currentPage }, { per_page: perPage }, totalProd)
                res.status(200).send(resultProduct)
            })
        })
    },

    filteringProduct: (req, res) => {
        const { name, category } = req.body
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per-page

        //Jika filter nama & kategori
        if (category && name) {

            let totalNameCate
            console.log("FilterNamaAndKategori")

            let countNameCate = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where product_name like '%${name}%' and category_name like '%${category}%';`
            // console.log("countNameCate",countNameCate)

            db.query(countNameCate, (errCountNameCate, resCountNameCate) => {
                if (errCountNameCate) {
                    res.status(400).send(errCountNameCate)
                }
                totalNameCate = resCountNameCate[0]

                let getProdCateName = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where product_name like '%${name}%' and category_name like '%${category}%' 
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCateName, (errGetProdCateName, resGetProdNameCate) => {
                    if (errGetProdCateName) {
                        res.status(400).send(errGetProdCateName)
                    }
                    let resProdNameCate = []
                    resProdNameCate.push(resGetProdNameCate, { current_page: currentPage }, { per_page: perPage }, totalNameCate)
                    res.status(200).send(resProdNameCate)
                })
            })

        } else if (!name && !category) { // filter tanpa inputan
            let totalCommon
            console.log("filterCommon")

            let countCommon = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories ;`

            db.query(countCommon, (errCountCommon, resCountCommon) => {
                if (errCountCommon) {
                    res.status(400).send(errCountCommon)
                }
                totalCommon = resCountCommon[0]

                let getProdCommon = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCommon, (errGetProdCommon, resGetProdCommon) => {
                    if (errGetProdCommon) {
                        res.status(400).send(errGetProdCommon)
                    }
                    let resProdCommon = []
                    resProdCommon.push(resGetProdCommon, { current_page: currentPage }, { per_page: perPage }, totalCommon)
                    res.status(200).send(resProdCommon)
                })
            })

        } else if (!name ) { //filter dengan kategori

            let totalCate
            console.log("FilterKategori")

            let countCate = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where category_name like '%${category}%';`

            db.query(countCate, (errCountCate, resCountCate) => {
                if (errCountCate) {
                    res.status(400).send(errCountCate)
                }
                totalCate = resCountCate[0]

                let getProdCate = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where category_name like '%${category}%'
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCate, (errGetProdCate, resGetProdCate) => {
                    if (errGetProdCate) {
                        res.status(400).send(resGetProdCate)
                    }
                    let resProdCate = []
                    resProdCate.push(resGetProdCate, { current_page: currentPage }, { per_page: perPage }, totalCate)
                    res.status(200).send(resProdCate)
                })
            })

        } else if (!category) { //filter dengan nama saja

            let totalName
            console.log("filterName")

            let countName = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where product_name like '%${name}%';`

            db.query(countName, (errCountName, resCountName) => {
                if (errCountName) {
                    res.status(400).send(errCountName)
                }
                totalName = resCountName[0]

                let getProdName = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where product_name like '%${name}%' 
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdName, (errGetProdName, resGetProdName) => {
                    if (errGetProdName) {
                        res.status(400).send(errGetProdName)
                    }
                    let resProdName = []
                    resProdName.push(resGetProdName, { current_page: currentPage }, { per_page: perPage }, totalName)
                    res.status(200).send(resProdName)
                })
            })
        }

    },

    sortingProduct: (req, res) => {
        const { name, category, orderBy, sortBy } = req.body
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per-page

        //Jika filter nama & kategori
        if (category && name) {

            let totalNameCate
            console.log("FilterNamaAndKategori")

            let countNameCate = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where product_name like '%${name}%' and category_name like '%${category}%';`
            // console.log("countNameCate",countNameCate)

            db.query(countNameCate, (errCountNameCate, resCountNameCate) => {
                if (errCountNameCate) {
                    res.status(400).send(errCountNameCate)
                }
                totalNameCate = resCountNameCate[0]

                let getProdCateName = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where product_name like '%${name}%' and category_name like '%${category}%'
                order by ${orderBy} ${sortBy}  
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCateName, (errGetProdCateName, resGetProdNameCate) => {
                    if (errGetProdCateName) {
                        res.status(400).send(errGetProdCateName)
                    }
                    let resProdNameCate = []
                    resProdNameCate.push(resGetProdNameCate, { current_page: currentPage }, { per_page: perPage }, totalNameCate)
                    res.status(200).send(resProdNameCate)
                })
            })

        } else if (!name && !category) { // filter tanpa input

            let totalCommon
            console.log("filterCommon")

            let countCommon = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories ;`

            db.query(countCommon, (errCountCommon, resCountCommon) => {
                if (errCountCommon) {
                    res.status(400).send(errCountCommon)
                }
                totalCommon = resCountCommon[0]

                let getProdCommon = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories
                order by ${orderBy} ${sortBy}
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCommon, (errGetProdCommon, resGetProdCommon) => {
                    if (errGetProdCommon) {
                        res.status(400).send(errGetProdCommon)
                    }
                    let resProdCommon = []
                    resProdCommon.push(resGetProdCommon, { current_page: currentPage }, { per_page: perPage }, totalCommon)
                    res.status(200).send(resProdCommon)
                })
            })

        } else if (!name) { //filter dengan kategori
            let totalCate
            console.log("FilterKategori")

            let countCate = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where category_name like '%${category}%';`

            db.query(countCate, (errCountCate, resCountCate) => {
                if (errCountCate) {
                    res.status(400).send(errCountCate)
                }
                totalCate = resCountCate[0]

                let getProdCate = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where category_name like '%${category}%'
                order by ${orderBy} ${sortBy} 
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdCate, (errGetProdCate, resGetProdCate) => {
                    if (errGetProdCate) {
                        res.status(400).send(resGetProdCate)
                    }
                    let resProdCate = []
                    resProdCate.push(resGetProdCate, { current_page: currentPage }, { per_page: perPage }, totalCate)
                    res.status(200).send(resProdCate)
                })
            })


        } else if (!category) { //filter dengan nama saja

            let totalName
            console.log("filterName")

            let countName = `select count(*) as totalItems 
            from product p1 inner join categories c2 
            on p1.id_categories = c2.id_categories 
            where product_name like '%${name}%';`

            db.query(countName, (errCountName, resCountName) => {
                if (errCountName) {
                    res.status(400).send(errCountName)
                }
                totalName = resCountName[0]

                let getProdName = `select * from product p1 inner join categories c2 
                on p1.id_categories = c2.id_categories 
                where product_name like '%${name}%'
                order by ${orderBy} ${sortBy}
                limit ${db.escape((currentPage - 1) * perPage)}, ${db.escape(perPage)};`

                db.query(getProdName, (errGetProdName, resGetProdName) => {
                    if (errGetProdName) {
                        res.status(400).send(errGetProdName)
                    }
                    let resProdName = []
                    resProdName.push(resGetProdName, { current_page: currentPage }, { per_page: perPage }, totalName)
                    res.status(200).send(resProdName)
                })
            })
        }
    }
}

