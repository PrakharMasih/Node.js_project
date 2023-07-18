const Product = require('../models/product');
const mongoose = require('mongoose');


exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(results => {
            const response = {
                count: results.length,
                products: results.map(result => {
                    return {
                        _id: result.id,
                        name: result.name,
                        price: result.price,
                        productImage: result.productImage,
                        request: {
                            type: "GET",
                            url: "/products/" + result._id
                        }
                    }
                })
            }
            if (results.length > 0) {
                res.status(200).json(response);
            }
            else {
                res.status(404).json({
                    message: "Product not found"
                })
            }

        })
        .catch(err => res.status(500).json(err));
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "product created",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "POST",
                        url: "/products/" + result._id
                    }
                }
            })
        })
        .catch(err => res.status(500).json({
            error: err.message
        }));

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: '/products/' + result._id
                    }
                });
            }
            else {
                res.status(404).json({
                    message: "Product Not Found"
                });
            }

        })
        .catch(err => res.status(500).json({ error: err }));
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    console.log(req.body);
    Product.findOneAndUpdate({ _id: id },{ $set: req.body })
        .exec()
        .then(result => {res.status(200).json({
            message: "Product updated",
            request: {
                type: 'PATCH',
                url: '/products/' + result._id
            }
        });
    }
        )
        .catch(err => res.status(500).json({
            error: err
        }));
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "DELETE",
                    url: "/products/" + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}