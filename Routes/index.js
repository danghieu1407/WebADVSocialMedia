
const express       = require('express');
const router        = express.Router();
router.get('/', function(req, res) {
  res.render('Pages/index');
});

router.get("/about", function(req, res) {
  res.render("Pages/about");
})

//

module.exports =router;