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
var UserTDT = require('../Models/UserModel')



router.get('/', isLoggedIn, (req, res, next) => {
    userTDTU = req.user;
    console.log(userTDTU);
    res.render('./Pages/index', { user: userTDTU });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
}


router.get("/about", function (req, res) {
    res.render("./Pages/about");
})


router.get("/UserProfile", isLoggedIn, (req, res, next) => {
    res.render('./Pages/UserProfile', { user: userTDTU });
});

router.post("/UserProfile", isLoggedIn, (req, res, next) => {
    var { Class, name, Faculty } = req.body;
    authId = req.user.authId;
    query = { authId: authId };
    var data = { name: name, Class: Class, Faculty: Faculty };
    UserTDT.findOneAndUpdate(query, { $set: data }, { new: true }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }

        console.log(doc);
    });

res.render('./Pages/UserProfile', { user: userTDTU });
});





module.exports = router;