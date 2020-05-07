var express = require('express');
var router = express.Router();


var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');



var pages = (req, res, next) => {

  var currentPage = parseInt(req.params.page) || 1;

  Product.countDocuments({}, function(err, count){
    res.locals.totalProducts = count;
    res.locals.currentPage = currentPage;
    res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
    next();
  });
}



router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });

});


router.get('/shopping-cart/addQty/:id',function(req, res, next){
  console.log('Add one quantity' + req.params.id);
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/shopping-cart');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
  });
});

router.get('/shopping-cart/reduceQty/:id',function(req, res, next){
  console.log('Reduce one quantity' + req.params.id);
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/shopping-cart');
    }
    cart.remove(product, product.id);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
  });

});

router.get('/shopping-cart/deleteAllQty/:id',function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/shopping-cart');
    }
    cart.removeAll(product, product.id);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
  });

});

router.get('/shopping-cart', function(req, res, next){
  var errorMsg = req.flash('error')[0];
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, errorMsg: errorMsg, noMsg : !errorMsg});
});

router.get('/checkout', isLoggedIn, function(req,res,next){
  if(!req.session.cart){
    res.redirect('/shopping-cart');
  } else{
    var cart = new Cart(req.session.cart);
    var order = new Order({
      user: req.user,
      cart: cart
    });
    
    var storedItems = cart.items;
    for (var items in storedItems){
      var productId = storedItems[items].item._id;
      var stock = storedItems[items].item.stock;
      var productQty = storedItems[items].qty;
      var flashMsgFlag = 0;
      var errorMessages = "";
      if(stock-productQty < 0){
        flashMsgFlag = 1;
        errorMessages += 'We cannot place the order since we only have ' + stock + ' ' + storedItems[items].item.title + ' left.';
      }
    }
    if(flashMsgFlag){
      req.flash('error',errorMessages);
      res.redirect('/shopping-cart');
    }
    else{
      for(var items in storedItems){
        var productId = storedItems[items].item._id;
        var stock = storedItems[items].item.stock;
        var productQty = storedItems[items].qty;
        stock = stock-productQty;
      
        Product.findOneAndUpdate(
          {_id : productId } ,
          { stock : stock }, function(err, result){
            console.log("Successfully updated");
          }
        );
        Product.findById(productId, function(err, product){
            console.log(product);
          });
        order.save(function(err, result){
          req.flash('success','Successfully bought products!');
          req.session.cart = null;
          res.redirect('/');
        });
      }
    }
  }
});


/* GET home page. */
router.get('/', pages, function(req, res, next) {
  var successMsg = req.flash('success')[0];

  var limit = res.locals.limit;
  var offset = res.locals.limit * (res.locals.currentPage-1);
  var query = Product.find({}).limit(limit).skip(offset).lean();
  query.exec((error, result) => {
    if (error) return console.error(error);
    res.render('shop/index', { 
      title: 'Music Store', 
      products: result, 
      successMsg: successMsg, 
      noMessages: !successMsg
    });
  });
});

router.get('/:page', pages, function(req, res, next) {
  if(req.params.page <= 1 ||  req.params.page > res.locals.totalPages){
    res.redirect('/');
  } 
  else{
    var successMsg = req.flash('success')[0];
    var currentPage = req.params.page;
    res.locals.currentPage = currentPage;
    var limit = res.locals.limit;
    var offset = res.locals.limit * (res.locals.currentPage-1);
    
    var query = Product.find({}).limit(limit).skip(offset).lean();
    query.exec((error, result) => {
      if (error) return console.error(error);
      res.render('shop/index', { 
        title: 'Music Store', 
        products: result, 
        successMsg: successMsg, 
        noMessages: !successMsg
      });
    });
  }
});


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}