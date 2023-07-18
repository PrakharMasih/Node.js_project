const express = require("express");
const route = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');

const OrderController = require('../controllers/orders')


route.get('/', checkAuth, OrderController.orders_get_all );                     // GET ALL ORDERS
 
route.post('/', checkAuth, OrderController.orders_create_order );               // CREATE ORDER

route.get('/:orderId', checkAuth, OrderController.orders_get_order );           // GET ORDER BY ID

route.delete('/:orderId', checkAuth, OrderController.orders_delete_order );     //DELETE ORDER

module.exports = route;