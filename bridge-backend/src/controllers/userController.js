
const User = require("../models/user");
const crypto = require("crypto");

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
            return res
                .status(401)
                .send({ error: "Login failed! Check authentication credentials" });
        }
        // Check if the password matches
        const isPasswordMatch = await user.comparePassword(req.body.password);
        if (!isPasswordMatch) {
            return res
                .status(401)
                .send({ error: "Login failed! Check authentication credentials" });
        }
        // Generate an auth token
        const token = await user.generateAuthToken();
        // Respond with user and their token
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Logout logic
exports.logout = async (req, res) => {
    try {
        // Remove the token from the user's array of tokens
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();

        res.send({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Password reset request logic
exports.requestPasswordReset = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // You might want to limit information here to prevent email enumeration
            return res.status(404).send({ error: "User not found" });
        }

        // Generate a password reset token
        user.passwordResetToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Send the password reset token to the user's email
        // Here, integrate with an email service to send the token
        // sendPasswordResetEmail(user.email, user.passwordResetToken);

        res.send({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Password reset logic
exports.resetPassword = async (req, res) => {
    s;
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send({ error: "Token is invalid or has expired" });
        }

        // Set the new password and clear the reset token
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.send({ message: "Password has been reset successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update password logic
exports.updatePassword = async (req, res) => {
    try {
        const user = req.user;
        const { newPassword } = req.body;

        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.send({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get user profile logic
exports.getProfile = async (req, res) => {
    try {
        // We don't want to send the password and tokens array back in the response
        // So we make sure to remove them from the result
        const { password, tokens, ...userWithoutSensitiveData } =
            req.user.toObject();

        res.send(userWithoutSensitiveData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update user profile logic
exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const updateFields = req.body;

        Object.keys(updateFields).forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        if (req.file) {
            user.profileImage = req.file.path; // Save the path of the uploaded file
        }

        if (typeof req.body.skills === "string") {
            user.skills = req.body.skills.split(",").map((skill) => skill.trim());
        }

        await user.save();
        res.send({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.checkUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            return res.status(409).send({ error: "Username already taken" });
        }
        res.send({ message: "Username is available" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getAssignedTasks = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username })
                                .populate({
                                    path: 'assignedTasks',
                                    populate: { path: 'project', select: 'name' } // Populating project name
                                });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.assignedTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

