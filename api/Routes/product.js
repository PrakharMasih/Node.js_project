const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);          // can return an error instead of null
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,                    // 10MB
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

// GET ALL PRODUCT
route.get('/', (req, res, next) => {
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
});

// CREATE NEW PRODUCT
route.post('/', upload.single('productImage'), (req, res, next) => {
    // console.log(req.file);
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

});


// GET PRODUCT BY ID
route.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: '/products/' + result._id
                    }
                });
            }
            else {
                res.status(404).json({
                    message: "Product Not Found"
                })
            }

        })
        .catch(err => res.status(500).json({ error: err }));
});


// UPDATE PRODUCT
route.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findOneAndUpdate(
        { _id: id },
        { $set: req.body })
        .exec()
        .then(result => res.status(200).json({
            message: "Product updated",
            request: {
                type: 'PATCH',
                url: '/products/' + result._id
            }
        })
        )
        .catch(err => res.status(500).json({
            error: err
        }));
});

// DELETE PRODUCT
route.delete('/:productId', (req, res, next) => {
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
});


module.exports = route;