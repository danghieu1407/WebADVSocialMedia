const express = require('express');
const router = express.Router();
var session = require('express-session');
var passport = require('passport');
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
router.use(passport.initialize());
router.use(passport.session());



router.get('/', isLoggedIn, (req, res, next) => {
    console.log(req.user);
    res.render('./Pages/index', { user: req.user});
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  
        return next();
    res.redirect('/user/login');
}


router.get("/about", function (req, res) {
    res.render("./Pages/about");
})



module.exports = router;