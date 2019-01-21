const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const route = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case "image/jpeg":
        case "image/png":
            {
                cb(null, true);
                break;
            }
        default:
            {
                cb(null, false);
            }
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

route.post('/', upload.single('productImage'), (req, res) => {
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
        })
});

route.get('/', (req, res) => {
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
        })
});

route.get('/:id', (req, res) => {
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
        })
});

route.put('/:id', (req, res) => {
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
        })
});

route.delete('/:id', (req, res) => {
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
        })
})

module.exports = route;