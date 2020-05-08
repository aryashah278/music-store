var express = require('express');
var router = express.Router();
const multer = require('multer');
var moment = require('moment');
var path = require('path');


var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
})


var pages = (req, res, next) => {

    var currentPage = parseInt(req.params.page) || 1;

    Product.count({isDeleted: false}, function (err, count) {
        res.locals.totalProducts = count;
        res.locals.currentPage = currentPage;
        res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
        next();
    });
}

router.get('/addNewItem', function (req, res) {
    res.render('shop/newItem');
});


router.post('/addNewItem', upload.single('imagePath'), function (req, res) {
    // console.log(req);
    var prod = new Product({
        imagePath: '/images/' + req.file.originalname,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        isDeleted: false
    })
    prod.save(function (err, result) {
        if (err) throw err;
        res.redirect('/');
    });
});


router.get('/editItem/:id', function (req, res, next) {
    Product.findById(req.params.id, function (err, result) {
        if (err) console.log(err);
        console.log(result);
        res.render('shop/editItem', {details: result})
    }).lean();
});

router.post('/editItem/:id', upload.single('imagePath'), function (req, res) {
    if (req.file) {
        Product.findOneAndUpdate(
            {_id: req.params.id},
            {
                imagePath: '/images/' + req.file.originalname,
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock,
                isDeleted: false
            }).then((updateDoc) => {
        })
        res.redirect('/')
    } else {
        Product.findOneAndUpdate({_id: req.params.id},
            {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock,
                isDeleted: false
            }).then((updateDoc) => {
        })
        req.flash('editItemMsg', 'Successfully edited a product!');
        res.redirect('/')
    }
});


router.get('/deleteItem/:id', function (req, res, next) {
    Product.findByIdAndUpdate(
        {_id: req.params.id},
        {isDeleted: true},
        function (err, result) {
            req.flash('deletedItemMsg', 'Successfully deleted a product!');
            if (err) console.log(err);
            res.redirect('/');
        }
    );
})

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });

});


router.get('/shopping-cart/addQty/:id', function (req, res, next) {
    console.log('Add one quantity' + req.params.id);
    var productId = req.params.id;
    var cart = new Cart(req.session.cart);
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/shopping-cart');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    });
});

router.get('/shopping-cart/reduceQty/:id', function (req, res, next) {
    console.log('Reduce one quantity' + req.params.id);
    var productId = req.params.id;
    var cart = new Cart(req.session.cart);
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/shopping-cart');
        }
        cart.remove(product, product.id);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    });

});

router.get('/shopping-cart/deleteAllQty/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart);
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/shopping-cart');
        }
        cart.removeAll(product, product.id);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    });

});

router.get('/shopping-cart', function (req, res, next) {
    var errorMsg = req.flash('error')[0];
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        errorMsg: errorMsg,
        noMsg: !errorMsg
    });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        res.redirect('/shopping-cart');
    } else {
        var cart = new Cart(req.session.cart);
        var current_date = new Date();
        var order = new Order({
            user: req.user,
            cart: cart,
            order_date: current_date
        });
        console.log(current_date);
        console.log(order);

        var storedItems = cart.items;
        for (var items in storedItems) {
            var productId = storedItems[items].item._id;
            var stock = storedItems[items].item.stock;
            var productQty = storedItems[items].qty;
            var flashMsgFlag = 0;
            var errorMessages = "";
            if (stock - productQty < 0) {
                flashMsgFlag = 1;
                errorMessages += 'We cannot place the order since we only have ' + stock + ' ' + storedItems[items].item.title + ' left.';
            }
        }
        if (flashMsgFlag) {
            req.flash('error', errorMessages);
            res.redirect('/shopping-cart');
        } else {
            for (var items in storedItems) {
                var productId = storedItems[items].item._id;
                var stock = storedItems[items].item.stock;
                var productQty = storedItems[items].qty;
                stock = stock - productQty;

                Product.findOneAndUpdate(
                    {_id: productId},
                    {stock: stock}, function (err, result) {
                        console.log("Successfully updated");
                    }
                );
                order.save(function (err, result) {
                    req.flash('success', 'Successfully bought products!');
                    req.session.cart = null;
                    res.redirect('/');
                });
            }
        }
    }
});


/* GET home page. */
router.get('/', pages, function (req, res, next) {
    var isAdmin = false;
    if (typeof (req.user) !== 'undefined') {
        isAdmin = req.user.isAdmin;
    }

    var successMsg = req.flash('success')[0];
    var deletedItemMsg = req.flash('deletedItemMsg')[0];
    var editItemMsg = req.flash('editItemMsg')[0];
    var limit = res.locals.limit;
    var offset = res.locals.limit * (res.locals.currentPage - 1);
    var searchedFlag = false;
    var name = "";
    var category = "";
    if (Object.keys(req.query).length === 0) {
        var query = Product.find({isDeleted: false}).limit(limit).skip(offset).lean();
    } else {
        name = req.query.searchByName;
        category = req.query.searchByCategory;
        searchedFlag = true;
        var query;
        if (name != "" && category == "") {
            query = Product.find({
                title: {$regex: name, $options: "i"},
                isDeleted: false
            }).limit(limit).skip(offset).lean();
            Product.count({title: {$regex: name, $options: "i"}}, function (err, count) {
                res.locals.totalProducts = count;
                res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
            });
        } else if (name == "" && category != "") {
            query = Product.find({category: category, isDeleted: false}).limit(limit).skip(offset).lean();
            Product.count({category: category}, function (err, count) {
                res.locals.totalProducts = count;
                res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
                console.log(res.locals.totalPages);
            });
        } else if (name != "" && category != "") {
            query = Product.find({
                category: category,
                isDeleted: false,
                title: {$regex: name, $options: "i"}
            }).limit(limit).skip(offset).lean();
            Product.count({category: category, title: {$regex: name, $options: "i"}}, function (err, count) {
                res.locals.totalProducts = count;
                res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
            });
        } else {
            query = Product.find({isDeleted: false}).limit(limit).skip(offset).lean();
            //default values are fine here.
        }
    }


    query.exec((error, result) => {
        if (error) return console.error(error);

        res.render('shop/index', {
            title: 'Music Store',
            products: result,
            successMsg: successMsg,
            deletedItemMsg: deletedItemMsg,
            editItemMsg: editItemMsg,
            noMessages: !successMsg && !deletedItemMsg && !editItemMsg,
            searchedFlag: searchedFlag,
            searchedName: name,
            searchedCategory: category,
            isAdmin: isAdmin
        });
    });
});

router.get('/:page', pages, function (req, res, next) {
    if (req.params.page <= 1 || req.params.page > res.locals.totalPages) {
        if (Object.keys(req.query).length === 0) {
            res.redirect('/');
        } else {
            res.redirect('/?searchByName=' + req.query.searchByName + '&searchByCategory=' + req.query.searchByCategory);
        }
    } else {
        var isAdmin = false;
        if (typeof (req.user) !== 'undefined') {
            isAdmin = req.user.isAdmin;
        }
        console.log(isAdmin);
        var successMsg = req.flash('success')[0];
        var currentPage = req.params.page;
        res.locals.currentPage = currentPage;
        var limit = res.locals.limit;
        var offset = res.locals.limit * (res.locals.currentPage - 1);
        var searchedFlag = false;
        var name = "";
        var category = "";

        if (Object.keys(req.query).length === 0) {
            var query = Product.find({isDeleted: false}).limit(limit).skip(offset).lean();
        } else {
            name = req.query.searchByName;
            category = req.query.searchByCategory;
            searchedFlag = true;
            var query;
            if (name != "" && category == "") {
                query = Product.find({
                    isDeleted: false,
                    title: {$regex: name, $options: "i"}
                }).limit(limit).skip(offset).lean();
                Product.count({title: {$regex: name, $options: "i"}}, function (err, count) {
                    res.locals.totalProducts = count;
                    res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
                });
            } else if (name == "" && category != "") {
                query = Product.find({isDeleted: false, category: category}).limit(limit).skip(offset).lean();
                Product.count({category: category}, function (err, count) {
                    res.locals.totalProducts = count;
                    res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
                    console.log(res.locals.totalPages);
                });
            } else if (name != "" && category != "") {
                query = Product.find({
                    isDeleted: false,
                    category: category,
                    title: {$regex: name, $options: "i"}
                }).limit(limit).skip(offset).lean();
                query = Product.find({
                    isDeleted: false,
                    category: category,
                    title: {$regex: name, $options: "i"}
                }).limit(limit).skip(offset).lean();
                Product.count({category: category, title: {$regex: name, $options: "i"}}, function (err, count) {
                    res.locals.totalProducts = count;
                    res.locals.totalPages = Math.ceil(res.locals.totalProducts / res.locals.limit);
                });
            } else {
                query = Product.find({isDeleted: false}).limit(limit).skip(offset).lean();
            }
        }

        query.exec((error, result) => {
            if (error) return console.error(error);
            res.render('shop/index', {
                title: 'Music Store',
                products: result,
                successMsg: successMsg,
                noMessages: !successMsg,
                searchedFlag: searchedFlag,
                searchedName: name,
                searchedCategory: category,
                isAdmin: isAdmin
            });
        });
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
