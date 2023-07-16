const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/practice');


const productRoute = require('./api/Routes/product.js');
const orderRoute = require('./api/Routes/orders.js');
const userRoute = require('./api/Routes/users.js');

app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'));     //REQUEST_LOGGER- dev :method :url :status :response-time ms - :res[content-length] 
                            //USED TO DISPLAY REQ INFO ON CONSOLE

app.use(bodyParser.urlencoded({extended: false}));     //only parses urlencoded bodies
app.use(bodyParser.json());     //The extended option allows to choose between parsing the URL-encoded data 
                                //with the querystring library (when false) or the qs library (when true).

app.use(cors());            //Cross-Origin Resource Sharing in Node.js is a mechanism by which a front-end 
                            //client can make requests for resources to an external back-end server.



app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/users', userRoute);

app.use((req, res, next) =>{
    const error = new Error('Page Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

app.listen(8000 , () => {
    console.log("server is running on 8000");
});