const mongoose = require('mongoose');
const Product = require('../models/product');

exports.product_create = (req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(response => {
            res.json({
                message: 'Product Saved',
                response,
                request: {
                    type: 'GET',
                    url: `http://localhost:8080/products/${response._id}`
                }
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};

exports.product_get_all = (req, res) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                res.json({
                    message: "Products are fetched",
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            [doc.name]: doc,
                            request: {
                                method: 'GET',
                                url: `http://localhost:8080/products/${doc._id}`
                            }
                        }
                    })
                })
            } else {
                res.json({
                    message: "Database is empty"
                })
            }
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};

exports.product_get_id = (req, res) => {
    Product.findById(req.params.id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.json({
                    message: "Product fetched for the requested ID",
                    [doc.name]: doc
                });
            } else {
                res.json({
                    message: "Product not found for the requested ID"
                })
            }
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};

exports.product_update = (req, res) => {
    const id = req.params.id;
    const updatedProduct = {}
    for (let key in req.body) {
        updatedProduct[key] = req.body[key]
    }
    Product.updateOne({
            _id: id
        }, {
            $set: updatedProduct
        })
        .exec()
        .then(response => {
            res.json({
                message: "Product updated for the requested ID",
                response
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};

exports.product_delete = (req, res) => {
    const id = req.params.id;
    Product.deleteOne({
            _id: id
        })
        .exec()
        .then(response => {
            res.json({
                message: "Product deleted for the requested ID",
                response
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};