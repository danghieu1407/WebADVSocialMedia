const express = require('express');
const router = express.Router();
const db = require('../db')
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())


router.get('/login', (req, res, next) => {
    res.render('Layout/login', { layout: `./Layout/login` })
})

router.post("/login", function (req, res) {
    res.send("T xu li viec  dang nhap")
})


router.get("/UserProfile", function (req, res) {
    res.render('./Pages/UserProfile',{ layout: `./Layout/layout` })
})


module.exports = router;