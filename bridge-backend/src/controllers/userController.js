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

// Assuming the User model's password and tokens fields should not be returned in the profile.
exports.getProfile = async (req, res) => {
    // We don't want to send the password and tokens array back in the response
    // So we make sure to remove them from the result
    const { password, tokens, ...userWithoutSensitiveData } = req.user.toObject();

    res.send(userWithoutSensitiveData);
};
