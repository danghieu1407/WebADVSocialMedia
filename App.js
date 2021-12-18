
require("dotenv").config();
var express           = require('express');
const expressLayouts  = require('express-ejs-layouts');
var app               = express();

var UserRouter = require('./Routes/user');



app.set("layout","./Layout/layout");
app.set('view engine', 'ejs');
app.set("layout extractScripts", true)



app.use(express.static("public"));
app.use(expressLayouts);
app.use("/user",UserRouter);
// use res.render to load up an ejs view file

// index page

app.get('/', function(req, res) {
  res.render('Pages/index');
});





app.get("/about", function(req, res) {
  res.render("Pages/about");
})

//
const port = process.env.PORT || 8080;
app.listen(port);
console.log("Server started on port" + port);