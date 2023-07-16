const express = require("express");
const route = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

// GET ALL ORDERS
route.get('/', (req, res, next) => {
    Order.find()
        .then(results => {
            const response = results.map(result => {
                return {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity,
                    request: {
                        type: "GET",
                        url: "/orders/"
                    }
                }
            })
            if (results.length > 0) {
                res.status(200).json(response);
            }
            else {
                res.status(404).json({
                    Message: "Order not found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// CREATE ORDER
route.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
        .then(result => {
            res.status(201).json({
                _id: result._id,
                productId: result.productId,
                quantity: result.quantity,
                request: {
                    type: "POST",
                    url: "/orders/"
                }
            });
        })
        .catch(err => res.status(500).json({ error: err }));
});

// GET ORDER BY ID
route.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(result => {
            res.status(200).json({
                // order: result,             //VALID WAY TO RETURN ALL DATA AT ONCE OR SIMPLY json(result)

                _id: result._id,
                productId: result.productId,
                quantity: result.quantity,
                request: {
                    type: "GET",
                    url: "/orders/"
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
});

//DELETE ORDER
route.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove(id)
        .exec()
        .then(result =>  res.status(200).json({
            Message: "order deleted",
            request: {
                type: "DELETE",
                url: "/orders/" + result._id
            }
        }))
        .catch(err => res.status(500).json({error:err}));
});

module.exports = route;