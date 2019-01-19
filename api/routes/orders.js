const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

const route = express.Router();

route.post('/', (req, res) => {
    Product.findById(req.body.productId)
        .select('_id product quantity')
        .exec()
        .then(doc => {
            if (!doc) return res.json({
                message: "Product Code not found"
            });
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(response => {
            res.json({
                message: "Order Saved",
                order: response
            });
        })
        .catch(error => {
            res.json({
                error
            });
        })
});

route.get('/', (req, res) => {
    Order.find()
        .select('_id product quantity')
        .then(docs => {
            if (docs.length > 0) {
                res.json({
                    message: "Orders Fetched",
                    count: docs.length,
                    orders: docs.map(doc => {
                        const {
                            _id,
                            product,
                            quantity
                        } = doc;
                        return {
                            _id,
                            product,
                            quantity,
                            request: {
                                type: 'GET',
                                url: `http://localhost:8080/orders/${_id}`
                            }
                        }
                    }),
                });
            } else {
                res.json({
                    message: "Orders List is empty"
                });
            }
        })
        .catch(error => {
            res.json({
                error
            });
        })
});

route.get('/:id', (req, res) => {
    Order.findById(req.params.id)
        .select('_id product quantity')
        .exec()
        .then(doc => {
            if (!doc) return res.json({
                message: "Order not found for the requested ID"
            });
            return res.json({
                message: "Order fetched for the requested ID",
                order: doc,
                request: {
                    type: 'GET',
                    url: `http://localhost:8080/orders/${doc._id}`
                }
            });
        })
        .catch(error => {
            res.json({
                error
            });
        })
});

route.delete('/:id', (req, res) => {
    Order.deleteOne({
            _id: req.params.id
        })
        .exec()
        .then(result => {
            res.json({
                message: "Order Deleted",
                result
            });
        })
        .catch(error => {
            res.json({
                error
            });
        })
});

route.put('/:id', (req, res) => {
    const updatedOrder = {}
    for (let key in req.body) {
        updatedOrder[key] = req.body[key];
    }
    Order.updateOne({
        _id: req.params.id
    }, {
        $set: updatedOrder
    })
    .exec()
    .then(result => {
        res.json({
            message: "Order Update for the requested ID",
            result
        })
    })
    .catch(error => {
        res.json({
            error
        });
    })
});

module.exports = route;