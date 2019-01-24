const express = require('express');
const route = express.Router();

const orderControls = require('../controllers/order');

route.post('/', orderControls.order_create);

route.get('/', orderControls.order_get_all);

route.get('/:id', orderControls.order_get_id);

route.delete('/:id', orderControls.order_delete);

route.put('/:id', orderControls.order_update);

module.exports = route;