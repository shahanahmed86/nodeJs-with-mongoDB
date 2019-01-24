const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res) => {
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
};

exports.user_login = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (!user) return res.json({
                message: "Authentication Failed",
                user
            });
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) return res.json({
                    message: "Authentication Failed",
                    err,
                });
                if (!result) return res.json({
                    message: "Authentication Failed",
                    result
                });
                const token = jwt.sign({
                    userId: user._id,
                    email: user.email,
                    password: user.password,

                }, 'secret', {
                    expiresIn: '1h'
                });
                res.json({
                    message: "Logged in Successfull",
                    token
                });
            })
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};