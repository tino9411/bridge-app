const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateAuthToken = (user) => {
    return jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });
};

// Handle user registration
exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = generateAuthToken(user);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Handle user login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const isPasswordMatch = await user.comparePassword(req.body.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = generateAuthToken(user);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};
