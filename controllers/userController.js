const Pdf = require('../models/pdf')
const User = require('../models/user')
const Audio = require('../models/audio')
const Video = require('../models/video')
const fs = require('fs');
const path = require('path')
const { resolve } = require('path');
const PDFImage = require("pdf-image").PDFImage;
const exec = require("child_process").exec;
const util = require("util");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const accessTokenSecret = 'youraccesstokensecret';

const userController = {
    login: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            const user = await User.findOne({ email: email, role: role });

            if (!user) {
                return res.status(400).send('User Not Found');
            }

            if (role != 2 && !user.verified) {
                let transporter = nodemailer.createTransport({
                    host: "smtp.simply.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                      user: "test1@tektum.dk", // generated ethereal user
                      pass: "Rosenberg82", // generated ethereal password
                    },
                });
    
                const token = jwt.sign({email: user.email}, accessTokenSecret);
    
                let baseUrl = 'http://localhost:3000/#/';
    
                if (role == 2) {
                    baseUrl = 'http://localhost:8000/#!/'
                }
                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"JoiningKwe" <support@dombore.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Thank you for your Register", // Subject line
                    // text: "Hello world?", // plain text body
                    html: `<b>To verify your account, Please click following <a href='${baseUrl}verification?token=${token}'>Link</a></b>`, // html body
                });

                return res.status(200).json({verified: false});
            }

            if (bcrypt.compareSync(password, user.password)) {
                // Passwords match
                const accessToken = jwt.sign({_id: user._id, role: user.role}, accessTokenSecret);
        
                res.status(200).json({
                    accessToken,
                    verified: true
                });
            } else {
                // Passwords don't match
                res.status(400).send('Username or password incorrect');
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    },

    register: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            if (!req.body.name) {
                return res.status(400).send('Name is required');
            }

            if (!req.body.email) {
                return res.status(400).send('Email is required');
            }
            
            if (!req.body.password) {
                return res.status(400).send('Password is required');
            }
            
            const user = await User.findOne({ email: email });

            if (user) {
                return res.status(400).send('User Aleady Exist');
            }

            let newUser = new User();

            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = bcrypt.hashSync(req.body.password, 10);

            if (req.body.role) {
                newUser.role = req.body.role;
            }

            await newUser.save();

            let transporter = nodemailer.createTransport({
                host: "smtp.simply.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "test1@tektum.dk", // generated ethereal user
                  pass: "Rosenberg82", // generated ethereal password
                },
            });

            const token = jwt.sign({email: email}, accessTokenSecret);

            let baseUrl = 'http://localhost:3000/#/';

            if (role == 2) {
                baseUrl = 'http://localhost:8000/#!/'
            }
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"JoiningKwe" <support@dombore.com>', // sender address
                to: email, // list of receivers
                subject: "Thank you for your Register", // Subject line
                // text: "Hello world?", // plain text body
                html: `<b>To verify your account, Please click following <a href='${baseUrl}verification?token=${token}'>Link</a></b>`, // html body
            });

            const accessToken = jwt.sign({_id: newUser._id, role: newUser.role}, accessTokenSecret);
        
            res.status(200).json({
                success: true
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    },

    verification: async (req, res) => {
        try {
            const { token } = req.body;

            jwt.verify(token, accessTokenSecret, async (err, data) => {
                if (err) {
                    return res.sendStatus(403);
                }
      
                let email = data.email;

                let user = await User.findOne({ email: email });
    
                if (!user) {
                    return res.status(400).send('Invalid User');
                }

                user.verified = true;
                
                await user.save();
    
                const accessToken = jwt.sign({_id: user._id, role: user.role}, accessTokenSecret);
            
                res.status(200).json({
                    accessToken
                });
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message });
        }
    },

    forgotPassword: async (req, res) => {
        const { role } = req.body;
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.simply.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "test1@tektum.dk", // generated ethereal user
                  pass: "Rosenberg82", // generated ethereal password
                },
            });

            const token = jwt.sign({email: 'lazstar1127@gmail.com'}, accessTokenSecret);

            let baseUrl = 'http://localhost:3000/#/';

            if (role == 2) {
                baseUrl = 'http://localhost:8000/#!/'
            }
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"JoiningKwe" <support@dombore.com>', // sender address
                to: "lazstar1127@gmail.com", // list of receivers
                subject: "Reset Password", // Subject line
                // text: "Hello world?", // plain text body
                html: `<b>To reset password, Please click following <a href='${baseUrl}reset-password?token=${token}'>Link</a></b>`, // html body
            });

            res.status(200).json({ message: 'mail sent'});
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { password, token, role } = req.body;

            jwt.verify(token, accessTokenSecret, async (err, data) => {
                if (err) {
                    return res.sendStatus(403);
                }
      
                let email = data.email;

                if (!password) {
                    return res.status(400).send('Password is required');
                }
                
                let user = await User.findOne({ email: email });
    
                if (!user) {
                    if (role == 2) {
                        user = new User();
                        user.email = email;
                        user.role = 2;
                        user.verified = true;
                    } else {
                        return res.status(400).send('Invalid User');
                    }
                }

                user.password = bcrypt.hashSync(password, 10);
                
                await user.save();
    
                const accessToken = jwt.sign({_id: user._id, role: user.role}, accessTokenSecret);
            
                res.status(200).json({
                    accessToken
                });
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    }
}

module.exports = userController;