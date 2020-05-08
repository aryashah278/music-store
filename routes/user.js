var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    var username = req.user.name;
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        // console.log(req.user.isAdmin);
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        var orderFlag = true;
        if (orders.length == 0) {
            orderFlag = false;
        }
        console.log(orderFlag);
        console.log(orders);
        res.render('user/profile', {orders: orders, orderFlag: orderFlag, username: username});
    }).lean();
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', isLoggedOut, function (req, res, next) {
    next();
});

router.post('/verification', function (req, res, next) {
    User.findOne({email: req.body.email}, function (error, result) {
        if (error) console.log(error);
        if (result == null) {
            res.send(false);
        } else {
            res.send(true);
        }
    })
})
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
