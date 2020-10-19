const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page


router.get('/', (req, res) => {
  console.log(req.user)
  res.render('loginV', {  user: req.user });
})

router.get('/vendor', (req, res) => {
  console.log(req.user)
  res.render('vendor', {  user: req.user });
})


router.get('/users/checkout', (req, res) => {
 if(req.user){
  res.render('checkout', {  user: req.user });
 }else{
  res.redirect('/users/login');

 }
});

router.post('/shipping', (req, res) => {
  const { first_name, last_name, company, phone, address, street, country, town, } = req.body;
  let errors = [];

  if (!first_name || !last_name || !company || !phone || !address || !street || !country || !town ) {
    errors.push({ msg: 'Please enter all fields' });
  }



  if (errors.length > 0) {
    res.render('checkout', {
      errors,
      first_name,
      last_name,
      phone,
      address,
      country,
      town,
      street,
      company,
      user:req.user
    
    });
  } else {

    let item = {
      first_name,
      last_name,
      phone,
      address,
      country,
      town,
      street,
      company,
    
    }
    
    User.updateOne({ _id: req.user._id },{ shipping: item },
      function (err, product) {
        console.log(product)
        if (err) {
          res.json({
            error: err
          })
        }
      })
      console.log('jhzxjddn',req.user)
      res.redirect('/users/checkout');


  }
  

});


router.get('/shopping_cart', (req, res) => {

  if(req.user){
    Product.find({}, function (err, product) {
      console.log(product)
      res.render('shopping-cart', { product: product, user: req.user });
    });
     }else{
    res.redirect('/users/login');
  
   }
 

})



router.get('/shop', (req, res) => {
  Product.find({}, function (err, product) {
    res.render('shop', { product: product, user: req.user });
  });
});


router.get('/shopping_cart', (req, res) => {
  User.findOne({ id: req.user }).then(user => {
    if (user) {
      res.render('shopping-cart', {
        cart: user.cart
      });
    } else {
      res.redirect('/users/login');

    }

  })
});


router.get('/add_cart', (req, res) => {
  pId = req.query.id

  if (req.user) {

    let userID = req.user._id

    Product.findOne({ _id: pId }).then(p => {
      console.log(p)
      let cartItem = [{
        name: p.name,
        img: p.img,
        delivery: p.delivery,
        price: p.price,
        discount: p.discount,
        quantity: p.quantity,
        brand_name: p.brand_name
      }]

      User.updateOne({ _id: userID }, { $push: { cart: cartItem } },
        function (err, product) {
          console.log(product)
          if (err) {
            res.json({
              error: err
            })
          }
        })

      console.log(userID)
      console.log(req.user)
    



      res.redirect(`/shop`)
    })
  } else {
    res.redirect(`/users/login`)

  }

});

// // Dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     user: req.user
//   })
// );

// module.exports = router;

// // Dashboard
// router.get('/vendor', ensureAuthenticated, (req, res) => {
//   res.render('vendor', {
//     user: req.user
//   })


// });


router.get('/add_product', ensureAuthenticated, (req, res) =>
  res.render('addProducts', {
    user: req.user
  })
);




module.exports = router;
