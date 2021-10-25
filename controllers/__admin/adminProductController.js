const { db } = require('../../database')

module.exports = {
    getAllProdAdmin: (req, res) => {
        //make pagination
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per page
        let totalProd
        let countItems = `select count(*) as totalItemAdmin from product;`
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

    getProdAdminDetail: (req, res) => {
        let prodAdminDetail = `select *
        from product p1
        inner join categories c1 on p1.id_categories = c1.id_categories
        inner join (select id_product,  sum(stock_op) as TotalStockOperational 
        from stock group by id_product order by TotalStockOperational) s1
        on p1.id_product = s1.id_product
        where p1.id_product = ${req.params.id}
        group by p1.id_product;`
        db.query(prodAdminDetail, (errProdAdminDetail, resProdAdminDetail) => {
            if (errProdAdminDetail) {
                console.log(errProdAdminDetail)
                res.status(400).send(errProdAdminDetail)
            }
            res.status(200).send(resProdAdminDetail)
        })
    },

    editProduct: (req, res) => {
        let editProd = `update product set ? where id_product=${req.params.id};`
        db.query(editProd, req.body, (errEditProd, resEditProd) => {
            if (errEditProd) {
                console.log(errEditProd)
                res.status(400).send(errEditProd)
            }
            let updateProd = `select * from product p1 
            inner join categories c2 
            on p1.id_categories = c2.id_categories
            where p1.id_product = ${req.params.id}
            group by p1.id_product;`

            db.query(updateProd, (errUpdateProd, resUpdateProd) => {
                if (errUpdateProd) {
                    console.log(errUpdateProd)
                    res.send(400).send(errUpdateProd)
                }
                res.status(200).send(resUpdateProd)
            })
        })
    },

    getCategories: (req, res) => {
        let getCate = `select * from categories;`
        db.query(getCate, (errGetCate, resGetCate) => {
            if (errGetCate) {
                console.log(errGetCate)
                res.status(400).send(errGetCate)
            }
            res.status(200).send(resGetCate)
        })
    },

    getProdDetailStockOperational: (req, res) => {
        let getStockOp = `select p1.id_product, w1.id_warehouse, s1.stock_op, p1.product_name, w1.warehouse_name from stock s1
        inner join product p1 on p1.id_product = s1.id_product
        inner join warehouse w1 on s1.id_warehouse = w1.id_warehouse
        where p1.id_product= ${req.params.id};`
        db.query(getStockOp, (errGetStockOp, resGetStockOp) => {
            if (errGetStockOp) {
                console.log(errGetStockOp)
                res.status(400).send(errGetStockOp)
            }
            res.status(200).send(resGetStockOp)
        })
    },

    uploadEditProdDetail: (req, res) => {
        const id = +req.params.id
        console.log("file", req.file)

        if (!req.file) {
            res.status(400).send('NO FILE UPLOADED')
        }

        let updateProdImg = `update product set productimg = '${req.file.filename}'
        where id_product=${id};`
        db.query(updateProdImg, (errUpdateProdImg, resUpdateProdImg) => {
            if (errUpdateProdImg) {
                console.log(errUpdateProdImg)
                res.status(400).send(errUpdateProdImg)
            }
            // res.status(200).send(resUpdateProdImg)

            let prodImgUpdated = `select * from product p1 
            inner join categories c2 
            on p1.id_categories = c2.id_categories
            where p1.id_product = ${req.params.id}
            group by p1.id_product;`

            db.query(prodImgUpdated, (errProdImgUpdated, resProdImgUpdated) => {
                if (errProdImgUpdated) {
                    console.log(errProdImgUpdated)
                    res.status(400).send(errProdImgUpdated)
                }
                let resultUploadImg = resProdImgUpdated
                resultUploadImg.push({ success: true })
                res.status(200).send(resultUploadImg)
            })
        })
    },

    editStock: (req, res) => { //di edit product admin page
        const { stockOp, idx } = req.body
        let editStockOp = `UPDATE warehouse.stock
        SET stock_op = ${stockOp} 
        WHERE (id_product = ${req.params.id}) AND (id_warehouse = ${idx});`

        db.query(editStockOp, (errEditStockOp, resEditStockOp) => {
            if (errEditStockOp) {
                console.log(errEditStockOp)
                res.status(400).send(errEditStockOp)
            }
            res.status(200).send(resEditStockOp)
        })
    },

    addProduct: (req, res) => {
        const { name, category, description, price } = req.body
        console.log(req.body)

        if (!name || !category || !description || !price) {
            res.status(400).send("Please input all of data !")
        }

        let addProduct = `insert into product(product_name, id_categories, product_price, productimg, product_description )
        values(${db.escape(name)}, ${db.escape(category)}, ${db.escape(price)}, "pics", ${db.escape(description)});`

        db.query(addProduct, (errAddProduct, resAddProduct) => {
            if (errAddProduct) {
                console.log(errAddProduct)
                res.status(400).send(errAddProduct)
            }
            let getProdIDupdated = `select id_product from product where product_name=${db.escape(name)} and product_price=${db.escape(price)}`
            db.query(getProdIDupdated, (errGetProdID, resGetProdID) => {
                if (errGetProdID) {
                    console.log(errGetProdID)
                    res.status(400).send(errGetProdID)
                }
                res.status(200).send(resGetProdID[0])
            })
        })
    },

    deleteProduct: (req, res) => {
        const prodName = req.params.name
        let delProd = `delete from product where id_product = ${db.escape(req.params.id)};`
        db.query(delProd, (errDelProd, resDelProd) => {
            if (errDelProd) {
                console.log(errDelProd)
                res.status(400).send(errDelProd)
            }
            const currentPage = parseInt(req.params.page) || 1
            const perPage = parseInt(req.params.perPage) || 8

            let totalProd

            let countItems = `select count(*) as totalItemAdmin from product;`
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
                    resultProduct.push(resGetProd, { current_page: currentPage }, { per_page: perPage }, totalProd, { message: `${prodName} successfully deleted` })
                    res.status(200).send(resultProduct)
                })
            })
        })
    },

    addStockDefault: (req, res) => {
        let countWH = `select * from warehouse;`
        const id = +req.params.id

        db.query(countWH, (errCountWH, resCountWH) => {
            if (errCountWH) {
                console.log(errCountWH)
                res.status(400).send(errCountWH)

            }
            resCountWH.forEach(function(item) {
                let insertStock = `insert into stock (id_product, id_warehouse) values (${id}, ${item.id_warehouse});`
                db.query(insertStock, (errInsertStock, resInsertStock) => {
                    if (errInsertStock) {
                        console.log(errInsertStock)
                        res.status(400).send(errInsertStock)
                    }
                })
            }) 
            res.status(200).send(`Success add stock-default for new product id = ${id}`)
            // res.status(200).send(resCountWH[0])
            // for (let i = 0; i <= resCountWH.length; i++) {
                // let insertStock = `insert into stock (id_product, id_warehouse) values (${id}, ${i + 1});`
                // db.query(insertStock, (errInsertStock, resInsertStock) => {
                //     if (errInsertStock) {
                //         console.log(errInsertStock)
                //         res.status(400).send(errInsertStock)
                //     }
                // })
            // } res.status(200).send("Success add stock-default")
        })
    },

    deleteStock: (req, res) => {
        let delStock = `delete from stock where id_product=${db.escape(req.params.id)};`
        db.query(delStock, (errDelStock, resDelStock) => {
            if (errDelStock) {
                console.log(errDelStock)
                res.status(400).send(errDelStock)
            }
            res.status(200).send(resDelStock)
        })
    },

    prodReport: (req, res) => { //this month
        let prodRep = `select  sum(od.total_price) as TotalShop, od.id_product, p.product_name, p.product_price,
        sum(od.quantity) as QtySold
        from orderdetail od
        join warehouse.order o on od.order_number = o.order_number
        join product p on od.id_product = p.id_product
        where o.status = 'done' and o.order_date >= date_sub(curdate(), interval 30 day)
        group by od.id_product;`
        db.query(prodRep, (errGetProdRep, resGetProdRep) => {
            if (errGetProdRep) {
                console.log(errGetProdRep)
                res.status(400).send(errGetProdRep)
            }
            // res.status(200).send(resGetProdRep)
            let result = []
            let PR = resGetProdRep
            let resProdName = []
            let resProdQty = []
            let dates = "This month"
            PR.forEach(function (item) {
                resProdName.push(item.product_name)
                resProdQty.push(item.QtySold)
            })
            result.push(PR, resProdName, resProdQty, dates)
            res.status(200).send(result)
        })
    },

    prodSalesReport: (req, res) => { //filter dates
        const { startDate, endDate } = req.body

        if (startDate && endDate) {
            let prodSalesRepStartEnd = `select  sum(distinct od.total_price) as TotalShop, od.id_product, p.product_name, p.product_price,
            sum(od.quantity) as QtySold
            from orderdetail od
            join warehouse.order o on od.order_number = o.order_number
            join product p on od.id_product = p.id_product
            where o.status = 'done' and o.order_date between ${db.escape(startDate)} and ${db.escape(endDate)}
            group by od.id_product;`
            db.query(prodSalesRepStartEnd, (errGetProdSalesRep, resGetProdSalesRep) => {
                if (errGetProdSalesRep) {
                    console.log(errGetProdSalesRep)
                    res.status(400).send(errGetProdSalesRep)
                }
                // res.status(200).send(resGetProdSalesRep)
                let result = []
                let PR = resGetProdSalesRep
                let resProdName = []
                let resProdQty = []
                let modDateStart = startDate.split(/\D/g)
                let modDateEnd = endDate.split(/\D/g)
                let startDateChanged = [modDateStart[2], modDateStart[1], modDateStart[0]].join("-")
                let endDateChanged = [modDateEnd[2], modDateEnd[1], modDateEnd[0]].join("-")
                let dates = `During period ${startDateChanged} until ${endDateChanged}`
                PR.forEach(function (item) {
                    resProdName.push(item.product_name)
                    resProdQty.push(item.QtySold)
                })
                result.push(PR, resProdName, resProdQty, dates)
                res.status(200).send(result)
            })

        } else if (startDate && !endDate) {
            let prodSalesRepStartOnly = `select  sum(distinct od.total_price) as TotalShop, od.id_product, p.product_name, p.product_price,
            sum(od.quantity) as QtySold
            from orderdetail od
            join warehouse.order o on od.order_number = o.order_number
            join product p on od.id_product = p.id_product
            where o.status = 'done' and o.order_date = ${db.escape(startDate)}
            group by od.id_product;`
            db.query(prodSalesRepStartOnly, (errGetProdSalesRepStart, resGetProdSalesStart) => {
                if (errGetProdSalesRepStart) {
                    console.log(errGetProdSalesRepStart)
                    res.status(400).send(errGetProdSalesRepStart)
                }
                // res.status(200).send(resGetProdSalesStart)
                let result = []
                let PR = resGetProdSalesStart
                let resProdName = []
                let resProdQty = []
                let modDateStart = startDate.split(/\D/g)
                let startDateChanged = [modDateStart[2], modDateStart[1], modDateStart[0]].join("-")
                let dates = `On date ${startDateChanged}`
                PR.forEach(function (item) {
                    resProdName.push(item.product_name)
                    resProdQty.push(item.QtySold)
                })
                result.push(PR, resProdName, resProdQty, dates)
                res.status(200).send(result)
            })

        } else if (!startDate && endDate) {
            let prodSalesRepEndOnly = `select  sum(distinct od.total_price) as TotalShop, od.id_product, p.product_name, p.product_price,
            sum(od.quantity) as QtySold
            from orderdetail od
            join warehouse.order o on od.order_number = o.order_number
            join product p on od.id_product = p.id_product
            where o.status = 'done' and o.order_date = ${db.escape(endDate)}
            group by od.id_product;`
            db.query(prodSalesRepEndOnly, (errGetProdSalesRepEnd, resGetProdSalesEnd) => {
                if (errGetProdSalesRepEnd) {
                    console.log(errGetProdSalesRepEnd)
                    res.status(400).send(errGetProdSalesRepEnd)
                }
                // res.status(200).send(resGetProdSalesEnd)
                let result = []
                let PR = resGetProdSalesEnd
                let resProdName = []
                let resProdQty = []
                let modDateEnd = endDate.split(/\D/g)
                let endDateChanged = [modDateEnd[2], modDateEnd[1], modDateEnd[0]].join("-")
                let dates = `On date ${endDateChanged}`
                PR.forEach(function (item) {
                    resProdName.push(item.product_name)
                    resProdQty.push(item.QtySold)
                })
                result.push(PR, resProdName, resProdQty, dates)
                res.status(200).send(result)
            })

        } else if (!startDate && !endDate) {
            return res.status(400).send([true, "Input dates cannot be empty !"])
        }
    },

    prodRevenue: (req, res) => { //this month
        let prodRev = `select sum(od.total_price) as GrossRevenue, sum(od. quantity) as TotalQtySold
        from orderdetail od
        join warehouse.order o on od.order_number = o.order_number
        where o.status = 'done' and o.order_date >= date_sub(curdate(), interval 30 day);`
        db.query(prodRev, (errProdRev, resProdRev) => {
            if (errProdRev) {
                console.log(errProdRev)
                res.status(400).send(errProdRev)
            }
            // res.status(200).send(resProdRevTotal)
            let resRev = []
            let dates = "This month"
            resRev.push(resProdRev, dates)
            res.status(200).send(resRev)
        })
    },

    prodRevenueTotal: (req, res) => {
        let prodRevTotal = `select sum(od.total_price) as GrossRevenue, sum(od. quantity) as TotalQtySold
        from orderdetail od
        join warehouse.order o on od.order_number = o.order_number
        where o.status = 'done';`
        db.query(prodRevTotal, (errProdRevTotal, resProdRevTotal) => {
            if (errProdRevTotal) {
                console.log(errProdRevTotal)
                res.status(400).send(errProdRevTotal)
            }
            // res.status(200).send(resProdRevTotal)
            let resRevTotal = []
            let dates = "All time"
            resRevTotal.push(resProdRevTotal, dates)
            res.status(200).send(resRevTotal)
        })
    },

    prodRevenueDates: (req, res) => {
        const { revDateStart, revDateEnd } = req.body

        if (revDateStart && revDateEnd) {
            let prodRevStartEnd = `select sum(od.total_price) as GrossRevenue, sum(od. quantity) as TotalQtySold
        from orderdetail od
        join warehouse.order o on od.order_number = o.order_number
        where o.status = 'done' and o.order_date between ${db.escape(revDateStart)} and ${db.escape(revDateEnd)};`
            db.query(prodRevStartEnd, (errProdRevStartEnd, resProdRevStartEnd) => {
                if (errProdRevStartEnd) {
                    console.log(errProdRevStartEnd)
                    res.status(400).send(errProdRevStartEnd)
                }
                // res.status(200).send(resProdRevStartEnd)
                let resRevDate = []
                let dates = `from ${revDateStart} until ${revDateEnd}`
                resRevDate.push(resProdRevStartEnd, dates)
                res.status(200).send(resRevDate)
            })

        } else if (revDateStart && !revDateEnd) {
            let prodRevStart = `select sum(od.total_price) as GrossRevenue, sum(od. quantity) as TotalQtySold
            from orderdetail od
            join warehouse.order o on od.order_number = o.order_number
            where o.status = 'done' and o.order_date = ${db.escape(revDateStart)} ;`
            db.query(prodRevStart, (errProdRevStart, resProdRevStart) => {
                if (errProdRevStart) {
                    console.log(errProdRevStart)
                    res.status(400).send(errProdRevStart)
                }
                let resRevDate = []
                let dates = `On date ${revDateStart}`
                resRevDate.push(resProdRevStart, dates)
                res.status(200).send(resRevDate)
            })

        } else if (!revDateStart && revDateEnd) {
            let prodRevEnd = `select sum(od.total_price) as GrossRevenue, sum(od. quantity) as TotalQtySold
            from orderdetail od
            join warehouse.order o on od.order_number = o.order_number
            where o.status = 'done' and o.order_date = ${db.escape(revDateEnd)};`
            db.query(prodRevEnd, (errProdRevEnd, resProdRevEnd) => {
                if (errProdRevEnd) {
                    console.log(errProdRevEnd)
                    res.status(400).send(errProdRevEnd)
                }
                let resRevDate = []
                let dates = `On date ${revDateEnd}`
                resRevDate.push(resProdRevEnd, dates)
                res.status(200).send(resRevDate)
            })

        } else if (!revDateStart && !revDateEnd) {
            return res.status(400).send([true, "Input dates cannot be empty !"])
        }
    },

    mostBuyProduct: (req, res) =>{
        let mostBuy = `select od.id_product, p.product_name, c.category_name, p.productimg, p.product_price,
        sum(od.quantity) as TotalQtySold
        from orderdetail od
        join warehouse.order o on od.order_number = o.order_number
        join product p on p.id_product = od.id_product
        join categories c on c.id_categories = p.id_categories
        where o.status ='done'
        group by od.id_product
        order by TotalQtySold desc limit 3;`
        db.query(mostBuy,(errMostBuy,resMostBuy)=>{
            if(errMostBuy){
                console.log(errMostBuy)
                res.status(400).send(errMostBuy)
            }
            res.status(200).send(resMostBuy)
        })
    },

    filteringProductAdmin : (req, res)=>{
        const { name, category } = req.body
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per-page

        //Jika filter nama & kategori
        if (category && name) {

            let totalNameCate
            console.log("FilterNamaAndKategori")

            let countNameCate = `select count(*) as totalItemAdmin 
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

            let countCommon = `select count(*) as totalItemAdmin 
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

            let countCate = `select count(*) as totalItemAdmin 
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

            let countName = `select count(*) as totalItemAdmin 
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

    sortingProductAdmin: (req, res)=>{
        const { name, category, orderBy, sortBy } = req.body
        const currentPage = parseInt(req.query.page) || 1 //default query page
        const perPage = parseInt(req.query.perPage) || 8 //default query per-page

        //Jika filter nama & kategori
        if (category && name) {

            let totalNameCate
            console.log("FilterNamaAndKategori")

            let countNameCate = `select count(*) as totalItemAdmin 
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

            let countCommon = `select count(*) as totalItemAdmin 
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

            let countCate = `select count(*) as totalItemAdmin 
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

            let countName = `select count(*) as totalItemAdmin
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
    // addCategories: (req, res) => {
    //     const {cate_name} =req.body
    //     let addCate = `insert into categories(category_name)
    //     values(${db.escape(cate_name)}`

    //     db.query(cate_name,(errAddCate, resAddCate)=>{
    //         if(errAddCate){
    //             console.log(errAddCate)
    //             res.status(400).send(errAddCate)
    //         }
    //         res.status(200).send(resAddCate)
    //     })
    // },

    // editCategories: (req, res)=>{
    //     const{cate_name}= req.body
    //     let updateCate = `update categories set category_name=${db.escape(cate_name)} where id_categories=${req.params.id};`
    //     db.query(updateCate,(errUpdateCate, resUpdateCate)=>{
    //         if(errUpdateCate){
    //             console.log(errUpdateCate)
    //             res.status(400).send(errUpdateCate)
    //         }
    //         res.status(200).send('Category has been edited')
    //     })
    // },

    // deleteCategories: (req, res)=>{
    //     let delCate = `delete from categories where id_categories=${req.params.id};`
    //     db.query(delCate,(errDelCate, resDelCate)=>{
    //         if(errDelCate){
    //             console.log(errDelCate)
    //             res.status(400).send(errDelCate)
    //         }
    //         res.status(200).send(resDelCate)
    //     })
    // },

}