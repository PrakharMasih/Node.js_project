const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.orders_get_all =  (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', 'name')                // only getting name not the price
        .then(results => {
            const response = results.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
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
}

exports.orders_create_order = (req, res, next) => {
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
}

exports.orders_get_order = (req, res, next) => {
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
            res.status(500).json({ error: err });
        });
}

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove(id)
        .exec()
        .then(result => res.status(200).json({
            Message: "order deleted",
            request: {
                type: "DELETE",
                url: "/orders/" + result._id
            }
        }))
        .catch(err => res.status(500).json({ error: err }));
}