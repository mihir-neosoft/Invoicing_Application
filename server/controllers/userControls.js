const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');

const SECRET = "23c48bfc26bd4f6347b0dece088eb463";

const User = require('../db/userSchema');

const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, bio } = req.body
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exist" })

        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match" })

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, bio })

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })

        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}
module.exports = { signin, signup };