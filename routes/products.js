const express = require('express');
const router = express.Router();
const {database} = require('../config/helper');

/* Get all products details */
router.get('/', function (req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // Set the current page number. default 1
  let limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // Set the limit of items per page. default 10


  let startValue = 0;
  let endValue = 10;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0,10,20,30
    endValue = page * limit;
  }

  database.table('products as p')
      .join([
        {
          table: "categories as c",
          on: `c.id = p.cat_id`
        }
      ])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.id'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0) {
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: "No products found"});
        }
      })
      .catch(err => console.log(err));

});

/* Get single product details */
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;

  database.table('products as p')
      .join([
        {
          table: "categories as c",
          on: `c.id = p.cat_id`
        }
      ])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.images',
        'p.id'
      ])
      .filter({'p.id': productId})
      .get()
      .then(prod => {
        if (prod) {
          res.status(200).json(prod);
        } else {
          res.json({message: `No product found with product id ${productId}`});
        }
      })
      .catch(err => console.log(err));
});

/* Get All product from single Category */
router.get('/category/:catName', function (req, res) {
  let catName = req.params.catName;
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // Set the current page number. default 1
  let limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // Set the limit of items per page. default 10


  let startValue = 0;
  let endValue = 10;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0,10,20,30
    endValue = page * limit;
  }

  database.table('products as p')
      .join([
        {
          table: "categories as c",
          on: `c.id = p.cat_id`
        }
      ])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.id'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .filter({'c.title': {$like: catName}})
      .getAll()
      .then(prods => {
        if (prods.length > 0) {
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: `No product found with ${catName} category`});
        }
      })
      .catch(err => console.log(err));

});

module.exports = router;
