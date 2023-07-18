const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({ message: "Email already exists" })     // 409 = conflict
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({ message: "user created" });
                            })
                            .catch(err => res.status(500).json({ error: err }));
                    }
                })
            }
        })
}

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "user not exists"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth falied"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "auth successful",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth falied"
                });
            });
        })
        .catch(err => res.status(500).json({ error: err }));
}

exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndRemove(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted successfully"
            })
        })
        .catch(err => res.status(500).json({ error: err }));
}