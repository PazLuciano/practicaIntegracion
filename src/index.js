const express = require("express");
const mongoDBconnection = require("./database/mongo.config");
const routerProducts = require("./router/products.routes");
const routerCarts = require("./router/carts.routes");
const routerSession = require("./router/session.routes");
const initializePassport = require("./config/passport.config");
const passport = require("passport");
const cookieParser = require("cookie-parser")

const app = express();
const port = 8080;
const BASE = "api/v1"

const MONGODB = async () => {
    await mongoDBconnection()
}
MONGODB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use(`/${BASE}/products`, routerProducts)
app.use(`/${BASE}/carts` , routerCarts)
app.use(`/${BASE}/session`, routerSession)


app.listen(port, (req, res) => 
    console.log("API RUN PORT:",port)
)