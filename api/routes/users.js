const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

route.post('/signup', (req, res) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(response => {
            if (response.length > 0) {
                res.json({
                    message: "email already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(doc => {
                                res.json({
                                    message: "email created",
                                    doc
                                });
                            })
                            .catch(err => {
                                res.json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

route.delete('/:id', (req, res) => {
    User.deleteOne({
            _id: req.params.id
        })
        .exec()
        .then(result => {
            res.json({
                message: "User Deleted",
                result
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
});

route.get('/', (req, res) => {
    User.find()
        .exec()
        .then(docs => {
            res.json({
                message: "User data is fetched",
                docs
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
})

module.exports = route;