const User = require('../models/user');

// Registration logic
exports.register = async (req, res) => {
    try {
        // Create a new user instance with the request data
        const user = new User(req.body);
        // Save the user to the database
        await user.save();
        // Generate an auth token
        const token = await user.generateAuthToken();
        // Respond with the new user and auth token
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Login logic
exports.login = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        // Check if the password matches
        const isPasswordMatch = await user.comparePassword(req.body.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        // Generate an auth token
        const token = await user.generateAuthToken();
        // Respond with user and their token
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};