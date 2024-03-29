const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
require("dotenv").config();
const PORT = 2000;
const app = express();

// var path = require('path');
// var dir = path.join(__dirname, 'public');
// app.use(express.static(dir));
app.use(express.static("./public"));

app.use(cors());
app.use(express.json());
app.use(bearerToken());

const { db } = require("./database");
db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.message);
    return;
  }

  console.log("connected to MySQL as id " + db.threadId);
});

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to the Warehouse Shop</h1>`);
});

const {
  userRouter,
  productRouter,
  adminRouter,
  adminProductRouter,
  transactionRouter,
} = require("./routers");
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/admin", adminRouter);
app.use("/prod-admin", adminProductRouter);
app.use("/transaction", transactionRouter);

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
