const UserModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');

exports.postLogin = (req, res, next) => {
    console.log(req.body);
    console.log(res.data);
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser;
    UserModel.findOne({ email: email })
        .then(result => {
            // console.log(result);
            if (result) {
                fetchedUser = result;
                return bcrypt.compare(password, result.password);
            }
            else {
                const error = new Error("User not found");
                error.statusCode = 401;
                error.message = "User not found";
                throw error;
            }
        })
        .then(isEqual =>{
            if(!isEqual){
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id.toString()
            }, 'WinterIsComing',{expiresIn: '1h'});
            res.status(200).json({
                name: fetchedUser.name,
                token: token,
                userId: fetchedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.postSignUp = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error("Validation Failed");
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    // console.log(email,pass,name);
    bcrypt.hash(password, 12)
        .then(hashedPwd =>{
            const user = new UserModel({
                email: email,
                password: hashedPwd,
                name: name
            });
            return user.save();
        })
        .then(result =>{
            res.status(201)
                .json({
                    message: 'User Created',
                    userId: result._id
                })
        })
        .catch(err =>{
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};