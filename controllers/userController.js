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

const accessTokenSecret = 'youraccesstokensecret';

const userController = {
    login: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            const user = await User.findOne({ email: email, role: role });

            if (!user) {
                return res.status(400).send('User Not Found');
            }

            if (bcrypt.compareSync(password, user.password)) {
                // Passwords match
                const accessToken = jwt.sign({_id: user._id, role: user.role}, accessTokenSecret);
        
                res.status(200).json({
                    accessToken
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
            const { email, password } = req.body;

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

            const accessToken = jwt.sign({_id: newUser._id, role: newUser.role}, accessTokenSecret);
        
            res.status(200).json({
                accessToken
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;

            if (!req.body.password) {
                return res.status(400).send('Password is required');
            }
            
            let user = await User.findOne({ email: 'testadmin@test.com' });

            if (!user) {
                user = new User();
            }

            
            user.email = 'testadmin@test.com';
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role = 2;
            
            await user.save();

            const accessToken = jwt.sign({_id: user._id, role: user.role}, accessTokenSecret);
        
            res.status(200).json({
                accessToken
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    }
}

module.exports = userController;