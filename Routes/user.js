const express       = require('express');
const router        = express.Router();
const db            = require('../db')
var session         = require('express-session');
var passport        = require('passport');
const expressLayouts  = require('express-ejs-layouts');


router.get('/login', (req, res,next) => {
    res.render('Layout/login', {layout: `./Layout/login` })
    })

router.post("/login", function (req, res) {
    res.send("T xu li viec  dang nhap")
})


router.get("/UserProfile", function (req, res) {
    res.render("Pages/UserProfile");
})

module.exports =router;