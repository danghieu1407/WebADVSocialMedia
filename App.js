var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var app = express();

app.use(express.static("public"));
// set the view engine to ejs
app.use(expressLayouts);
app.set("layout","./Pages/layout");
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('Pages/index');
});


app.get("/about", function(req, res) {
  res.render("Pages/about");
})

// about page
app.get('/about', function(req, res) {
  res.render('Pages/about');
});

app.listen(3000);
console.log("Server started on port 3000");