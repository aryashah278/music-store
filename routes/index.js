var express = require('express');
var router = express.Router();


var Product = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find((error, result) =>{
    if (error) return console.error(error);
    res.render('shop/index', { title: 'Music Store', products: result });
  }).lean()
});



module.exports = router;
