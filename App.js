var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('Pages/index');
});

// about page
app.get('/about', function(req, res) {
  res.render('Pages/about');
});

app.listen(3000);