const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
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

// router.get('/ajax',function (req, res){
//     res.render('./Pages/index', {qoute: "AJAX la so 1"})
// })
router.use(bodyParser.json())
var UserTDT = require('../Models/UserModel')
let userTDTU;


router.get('/', isLoggedIn, (req, res, next) => {
    userTDTU = req.user;
    res.render('./Pages/index', { user: userTDTU });
});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
}


router.get("/about", function (req, res) {
    res.render("./Pages/about", { user: userTDTU });
})
// router.use(bodyParser.json())



router.get("/UserProfile", isLoggedIn, (req, res, next) => {
    res.render('./Pages/UserProfile', { user: userTDTU });
});

router.post("/UserProfile", isLoggedIn,  (req, res, next) => {
    const { name, Class, Faculty } = req.body;
    query = { authId: req.user.authId };
    var data = { name: name, Class: Class, Faculty: Faculty };
    userTemp =  UserTDT.findOneAndUpdate(query, { $set: data }, { new: true }, (err, doc) => 
    {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        userTDTU = doc;
        console.log(userTDTU);
        res.render('./Pages/UserProfile', { user: doc });
    })
    
});






module.exports = router;