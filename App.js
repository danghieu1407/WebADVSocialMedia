require("dotenv").config();
var express           = require('express');
var bodyParser        = require('body-parser')
var app               = express();
var authRouter        = require('./Routes/auth');
var UserRouter        = require('./Routes/user');
var IndexRouter       = require('./Routes/index');



const expressLayouts  = require('express-ejs-layouts');
app.set("layout","./Layout/layout");
app.set('view engine', 'ejs');
app.set("layout extractScripts", true)


app.use(express.static("public"));
app.use(bodyParser.json())

app.use(expressLayouts);
app.use("",IndexRouter);
app.use('/auth', authRouter);
app.use("/user",UserRouter);



const port = process.env.PORT || 8080;
app.listen(port);
console.log("Server started on port" + port);