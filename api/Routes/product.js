const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productControler = require('../controllers/products')

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
        cb(null, false);          //we can return an error instead of null
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


route.get('/', productControler.products_get_all );  // GET ALL PRODUCT

route.post('/', checkAuth, upload.single('productImage'), productControler.products_create_product );  // CREATE NEW PRODUCT

route.get('/:productId', productControler.products_get_product );  // GET PRODUCT BY ID

route.patch('/:productId', checkAuth, productControler.products_update_product );   // UPDATE PRODUCT

route.delete('/:productId', checkAuth, productControler.products_delete_product );   // DELETE PRODUCT


module.exports = route;