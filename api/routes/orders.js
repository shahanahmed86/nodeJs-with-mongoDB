const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

const route = express.Router();

route.post('/', (req, res) => {
    Product.findById(req.body.productId)
    .select('_id name price')
    .exec()
    .then(doc => {
        if (!doc) return res.json({ message: 'Product not found' });
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: doc,
            quantity: req.body.quantity,
        });
        return order.save()
        .then(result => {
            res.json({
                message: "Order saved",
                result: {
                    [result.product.name]: result,
                    request: {
                        type: 'GET',
                        url: `http:/localhost:8080/orders/${result._id}`
                    } 
                }
            });
        })
    })
    .catch(err => {
        res.json({
            error: err
        });
    })
});

module.exports = route;