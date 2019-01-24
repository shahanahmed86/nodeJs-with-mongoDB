const express = require('express');
const route = express.Router();

const userControls = require('../controllers/user');

route.post('/signup', userControls.user_signup);

route.post('/login', userControls.user_login);

module.exports = route;