const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

const app = express();

const {
    user,
    password
} = process.env;
const url = `mongodb://${user}:${password}@ds157654.mlab.com:57654/mongoose-practice`;
mongoose.connect(url, {
    useNewUrlParser: true
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/products', productRoute);
app.use('/orders', orderRoute);

module.exports = app;