const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
var session = require('express-session');
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;
const http = require('http');
const socketio = require('socket.io');
const db = require('../db')
var formidable = require('formidable')
var Admin = require('../Models/AdminModel')
const emailValidator = require('email-validator')
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));


router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json())

var UserTDT = require('../Models/UserModel')
var Post = require('../Models/Post');
const { start } = require('repl');
const { Passport } = require('passport');

let userTDTU; /* Biến Local để lấy thông tin sinh viên cho cột left - right */
let post; /*Lấy tất cả bài post trong moongose */


// Quài Bẻo thêm dô từ khúc này
router.get('/login', (req, res, next) => {

    res.render('Layout/login', { layout: `./Layout/login` })
})
temp = false // cai lon nay dung de xac nhan cho cai ham isLoggedIn

let tempcc;



router.post('/login', (req, res, next) => {
        let error = ''
        body = req.body
        let emailbt = body.email
        let passwordbt = body.password
        Admin.findOne({ email: emailbt })
            .then(user => {
                if (!emailbt) {
                    error = 'Vui lòng nhập email!'
                } else if (!emailbt.includes('@')) {
                    error = 'Email không hợp lệ!'
                } else if (!user) {
                    error = 'Tài khoản không tồn tại!'
                } else if (!passwordbt) {
                    error = 'Vui lòng nhập mật khẩu'
                } else if (passwordbt.length < 6) {
                    error = 'Mật khẩu phải từ 6 kí tự'
                } else if (passwordbt !== user.password) {
                    error = 'Mật khẩu không chính xác'
                }
                console.log(error)
                if (error.length > 0) {
                    res.render('./Layout/login', {
                        layout: `./Layout/login`,
                        errorMessage: error
                    })

                } else {
                    temp = true
                    body.authId = user.authId
                    body.role = user.role
                    body.name = user.name
                    body.created = user.created
                    body.updated = user.updated
                    body.avatar = user.avatar

                    const obj = JSON.parse(JSON.stringify(body));

                    tempcc = obj
                    req.session.email = req.body.email
                    return res.redirect('/')
                }
            })
    })
    // console.log(tempcc)
    // Tới khúc này





router.get('/', isLoggedIn, (req, res, next) => {

    if (!req.user) {
        userTDTU = tempcc

    } else {
        userTDTU = req.user;
    }
    /*userTDTU là user hiện tại đang login */
    /*Do 1 bài post thì phải cần tên và ảnh, nhưng post chỉ chứa ID nên phải gắn 2 table lại với nhau*/
    Post.aggregate([{
            $lookup: {
                from: "usertdtus",
                localField: "creator",
                foreignField: "authId",
                as: "user"
            }
        }, { "$unwind": "$user" },
        { $sort: { _id: -1 } },
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
        update_at: new Date()
    }).save(function(err, data) {
        if (err) return console.error(err);

        result = { post: data, user: userTDTU };
        res.send(result);
    });



});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }

});


router.post('/DeletePost', function(req, res) {
    console.log(req.body.IDPost);
    query = { _id: ObjectId((req.body.IDPost)) }
    Post.deleteOne(query, function(err, result) {
        if (err) console.log(err);
        else {
            res.send(req.body);
        }
    })
});
router.post("/loadmore", async(req, res) => {
    var limit = 2;
    var startFrom = parseInt(request.fields.startFrom);

    var user = await db.collection('posts').find({})
        .sort({ 'id': -1 })
        .skip(startFrom)
        .limit(limit)
        .toArray();
    result.json(user);


})

router.post("/EditPost", function(req, res) {
    console.log(req.body)
    query = { _id: ObjectId(req.body.IDPost) }
    Post.findOneAndUpdate(query, { $set: { content: req.body.content, update_at: new Date() } }, { new: true }, function(err, result) {
        if (err) console.log(err);
        else {
            res.send(result);
        }
    })
})


router.get("/UserProfile", isLoggedIn, (req, res, next) => {

    Post.find({ creator: userTDTU.authId }).sort({ _id: -1 }, ).then((result) => {
        res.render('./Pages/UserProfile', { user: userTDTU, post: result });
    })

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
router.get('/adminmanager', isLoggedIn, (req, res) => {
    res.render('./Pages/adminmanager', { user: userTDTU });
})

router.post('/adminmanager', isLoggedIn, (req, res) => {
    const { name } = req.body
    console.log(name)
    const newAccount = new UserTDT({
        name: req.body.name

    })
    newAccount.save((err) => {
        if (err) {
            res.json({
                result: "Failed",
                data: {},
                message: `Error is : ${err}`
            })
        } else {
            res.json({
                result: "ok",
                name: req.body.name


            })
        }
    })
})



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() || temp === true)
        return next();
    res.redirect('/login');
}

module.exports = router;