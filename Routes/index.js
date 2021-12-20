const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
var session = require('express-session');
var passport = require('passport');
const http = require('http');
const socketio = require('socket.io');

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));


router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json())


var UserTDT = require('../Models/UserModel')
var Post = require('../Models/Post')

let userTDTU; /* Biến Local để lấy thông tin sinh viên cho cột left - right */
let post;/*Lấy tất cả bài post trong moongose */
router.get('/', isLoggedIn, (req, res, next) => {
    userTDTU = req.user; /*userTDTU là user hiện tại đang login */
    /*Do 1 bài post thì phải cần tên và ảnh, nhưng post chỉ chứa ID nên phải gắn 2 table lại với nhau*/
    Post.aggregate([
        {
            $lookup:
            {
                from: "usertdtus",
                localField: "creator",
                foreignField: "authId",
                as: "user"
            }             
        },{"$unwind":"$user"},
        { $sort : { _id : -1 } },
    ]).then((result) => {
            post = result;
            res.render('./Pages/index', { user: userTDTU, post: post });
        }).catch((error) => {
            console.log(error);
        });
});

router.post('/', isLoggedIn, (req, res, next) => {
    new Post({
       creator: userTDTU.authId,
       content: req.body.content,
       create_at: new Date(),
       update_at:  new Date()
      }).save()
        .then(user => done(null, user))
        .catch(err => done(err, null));
    
    result={authId:userTDTU.authId,content:req.body.content,user:userTDTU};
    res.send(result)
});

router.get("/UserProfile", isLoggedIn, (req, res, next) => {
    res.render('./Pages/UserProfile', { user: userTDTU });
});


router.post("/UserProfile", isLoggedIn, (req, res, next) => {
    const { name, Class, Faculty } = req.body;
    query = { authId: req.user.authId };
    var data = { name: name, Class: Class, Faculty: Faculty };
    UserTDT.findOneAndUpdate(query, { $set: data }, { new: true }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        userTDTU = doc;
        console.log(userTDTU);

        res.render('./Pages/UserProfile', { user: doc });
    })

});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
}
module.exports = router;