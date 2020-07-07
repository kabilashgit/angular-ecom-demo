const express = require('express');
const router = express.Router();
const {database} = require('../config/helper');
/* GET home page. */
router.get('/', function (req, res) {
  let page = (res.query.page !== undefined && res.query.page !== 0) ? res.query.page : 1; // Set the current page number. default 1
  let limit = (res.query.limit !== undefined && res.query.limit !== 0) ? res.query.limit : 10; // Set the limit of items per page. default 10


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

module.exports = router;
