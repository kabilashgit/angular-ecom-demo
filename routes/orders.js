const express = require('express');
const router = express.Router();
const {database} = require('../config/helper');

/* Get All Orders */
router.get('/', (req, res) => {
  database.table('orders_details as od')
      .join([
        {
          table: 'orders as o',
          on: 'o.id = od.order_id'
        },
        {
          table: 'products as p',
          on: 'p.id = od.product_id'
        },
        {
          table: 'users as u',
          on: 'u.id = o.user_id'
        }
      ])
      .withFields([
        'o.id', 'p.title', 'p.description', 'p.price', 'u.username'
      ])
      .getAll()
      .then(orders => {
        if (orders.length > 0) {
          res.status(200).json(orders)
        } else {
          res.json({
            message: 'No orders found'
          })
        }
      })
      .catch(err => res.json(err))
});

/* Get single order */
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  database.table('orders_details as od')
      .join([
        {
          table: 'orders as o',
          on: 'o.id = od.order_id'
        },
        {
          table: 'products as p',
          on: 'p.id = od.product_id'
        },
        {
          table: 'users as u',
          on: 'u.id = o.user_id'
        }
      ])
      .withFields([
        'o.id', 'p.title', 'p.description', 'p.price', 'u.username'
      ])
      .filter({'o.id': orderId})
      .getAll()
      .then(orders => {
        if (orders.length > 0) {
          res.status(200).json(orders)
        } else {
          res.json({
            message: 'No orders found'
          })
        }
      })
      .catch(err => res.json(err))
});

// Place New Order
router.post('/new', async (req, res) => {
  // let userId = req.body.userId;
  // let productId = req.body.productId;
  let {
    userId,
    products
  } = req.body;
  // console.log(userId, products)


  if (userId !== null && userId > 0) {
    database.table('orders')
        .insert({
          user_id: userId
        })
        .then(newOrderId => {
          if (newOrderId > 0) {
            products.forEach(async (product) => {

              let data = await database.table('products')
                  .filter({
                    id: product.id
                  })
                  .withFields(['quantity'])
                  .get();

              let inCart = parseInt(product.incart);

              /* Deduct the number of pieces ordered from the quantity in database */

              if (data.quantity > 0) {
                data.quantity = data.quantity - inCart;

                if (data.quantity < 0) {
                  data.quantity = 0;
                }

              } else {
                data.quantity = 0;
              }

              // Insert order details w.r.t the newly created order Id
              database.table('orders_details')
                  .insert({
                    order_id: newOrderId,
                    product_id: product.id,
                    quantity: inCart
                  })
                  .then(newId => {
                    database.table('products')
                        .filter({
                          id: product.id
                        })
                        .update({
                          quantity: data.quantity
                        })
                        .then(successNum => {
                        })
                        .catch(err => console.log(err));
                  })
                  .catch(err => console.log(err));
            });

          } else {
            res.json({
              message: 'New order failed while adding order details',
              success: false
            });
          }
          res.status(200).json({
            message: `Order Successfully placed with order id ${newOrderId}`,
            success: true,
            order_id: newOrderId,
            products: products
          })

        })
        .catch(err => res.json(err));
  } else {
    res.json({
      message: 'New order failed',
      success: false
    });
  }

});

/* Fake payment gateway */
router.get('/payment', (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      success: true
    })
  }, 3000)
});

module.exports = router;
