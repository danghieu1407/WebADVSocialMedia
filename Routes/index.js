const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
var session = require('express-session');
var passport = require('passport');
const db = require('../db')

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
router.use(passport.initialize());
router.use(passport.session());


router.use(bodyParser.json())
var UserTDT = require('../Models/UserModel')
let userTDTU; /* Biến Local để lấy thông tin sinh viên cho cột left - right */


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

router.get('/adminmanager', isLoggedIn , (req , res)=>{
    res.render('./Pages/adminmanager', { user: userTDTU});
})

router.post('/adminmanager', isLoggedIn, (req,res)=>{
    const {name} = req.body
    console.log(name)
    const newAccount =  new UserTDT({
        name: req.body.name
       
    })
    newAccount.save((err) =>{
        if(err){
            res.json({
                result: "Failed",
                data: {},
                message: `Error is : ${err}`
            })
        }
        else{
            res.json({
                result: "ok",
                name:req.body.name
                
               
            })
        }
    })
})


module.exports = router;