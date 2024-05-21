const { body, validationResult } = require('express-validator');
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
require('dotenv').config()
const JWT_SECRET = process.env.Secret_key
//ROUTE 1: create a user using : POST '/api/auth/createuser'.No login required
router.post('/createuser', [
    body('name', "Enter a Valid Name").isLength({ min: 3 }),
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() })
    }
    // check wheather the user with this email exist already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "a user with email already exits" })
        }
        // create a new user
        const salt = await bcrypt.genSalt(10)
        const secpass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtdata)
        // res.json(user)
        success = true;
        res.json({success, authtoken })
    }
    // catch error
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

//ROUTE 2: Authenticate a user using: POST '/api/auth/login'.No creation required
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password can not be blank").exists()], async (req, res) => {
        //If there are errors, return bad request and the errors
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (!user) {
                success=false;
                return res.status(400).json({success, error: "please login using correct credentials" })
            }
            const passwordcompare = await bcrypt.compare(password, user.password);
            if (!passwordcompare) {
                success=false;
                return res.status(400).json({ success,error: "please login using correct credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken })
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    })

//ROUTE 3:Get loggedin user details using : POST '/api/auth/getuser'.login required 
router.post('/getuser',fetchuser, async (req, res) => {
        try {
            const userid = req.user.id;
            const user = await User.findById(userid).select("-password")
            res.send(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    })

module.exports = router;