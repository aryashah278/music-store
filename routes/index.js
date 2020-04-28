var express = require('express');
var Product = require('../models/product');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find((error, result) =>{
    if (error) return console.error(error);
    res.render('shop/index', { title: 'Music Store', products: result });
  }).lean()
});

router.get('/user/signup', function(req, res, next){
  res.render('user/signup', {csrfToken : req.csrfToken()})
});

module.exports = router;
