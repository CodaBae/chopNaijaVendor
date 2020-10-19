const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');



const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
var userID = ''


router.get('/login_vendor', forwardAuthenticated, (req, res) => res.render('loginV'));

router.get('/be_vendor', forwardAuthenticated, (req, res) => res.render('beVendor'));
router.get('/product_detail', (req, res) => res.render('product-detail'));





// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { first_name, last_name, email, phone, address, street, country, town, password, password2, } = req.body;
  let errors = [];

  if (!first_name || !last_name || !email || !phone || !address || !street || !country || !town || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 8) {
    errors.push({ msg: 'Your password must be at least 8 characters' });
  }
  if (password.search(/[a-z]/i) < 0) {
    errors.push({ msg: 'Your password must contain at least one letter.' });

  }
  if (password.search(/[0-9]/) < 0) {
    errors.push({ msg: 'Your password must contain at least one digit.' });

  }


  if (errors.length > 0) {
    res.render('register', {
      errors,
      first_name,
      last_name,
      phone,
      address,
      country,
      town,
      street,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          first_name,
          last_name,
          phone,
          address,
          country,
          town,
          street,
          email,
          password,
          password2
        });
      } else {
        let cart = []
        let billing = []
        let shipping = []


        const newUser = new User({
          first_name,
          last_name, 
          phone,
          address,
          country,
          town,
          street,
          email,
          password,
          billing,
          cart,
          shipping
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/shop',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });


// // Login
// router.post('/login', (req, res, next) => {
//   const { email, password } = req.body;

//   errors = []
//   User.findOne({
//     email: email
//   }).then(user => {
//     if (!user) {
//       errors.push({ msg: 'email does not exist' });
//       res.render('login', {
//         errors,
//         email,
//         password,
//       });


//     }
//     userID = user.id
//     res.redirect(`/?id=${user.id}`)
//   })
// })

// login_vendor
router.post('/login_vendor', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/vendor',
    failureRedirect: '/users/login_vendor',
    failureFlash: true
  })(req, res, next);
});

// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/log in');
// });


// Vendor
router.post('/be_vendor', (req, res) => {
  const { first_name, last_name, email, phone, address, country, state, password, password2, brand_name } = req.body;
  let errors = [];

  if (!first_name || !last_name || !email || !phone || !address || !brand_name || !country || !state || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('beVendor', {
      errors,
      first_name,
      last_name,
      brand_name,
      phone,
      address,
      country,
      state,
      email,
      password,
      password2
    });
  } else {
    Vendor.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('beVendor', {
          errors,
          first_name,
          last_name,
          brand_name,
          phone,
          address,
          country,
          state,
          email,
          password,
          password2
        });
      } else {

        const products = []
        const productNum = 0
        const orderNum = 0


        const newUser = new Vendor({
          first_name,
          last_name,
          brand_name,
          phone,
          address,
          country,
          state,
          email,
          password,
          password2,
          products,
          productNum,
          orderNum


        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login_vendor');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});



//  add Products
router.post('/add_product', (req, res) => {
  const { name, price, quantity, discount, delivery, brand_name, img } = req.body;
  let errors = [];

  if (!name || !price || !quantity || !discount || !delivery || !brand_name || !img) {
    errors.push({ msg: 'Please enter all fields' });
  }
  let userId = req.query.id

  Vendor.findOne({ _id: userId }).then(user => {

    if (errors.length > 0) {
      res.render('addProducts', {
        errors,
        user,
        name,
        price,
        quantity,
        brand_name,
        delivery,
        discount,
        img

      });
    } else {


      let productN = [{
        name,
        price,
        quantity,
        brand_name,
        delivery,
        discount,
        img
      }]


      Vendor.updateOne({ _id: userId }, { productNum: user.productNum + 1 },
        function (err, product) {
          console.log(product)
          if (err) {
            res.json({
              error: err
            })
          }
        })

      Vendor.updateOne({ _id: userId }, { $push: { products: productN } },
        function (err, product) {
          console.log(product)
          if (err) {
            res.json({
              error: err
            })
          }
        })

      const newUser = new Product({
        name,
        price,
        quantity,
        brand_name,
        delivery,
        discount,
        img
      });


      newUser
        .save()
        .then(user => {
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/users/login_vendor');
        })
        .catch(err => console.log(err));

    }

  })
});




module.exports = router;
