//user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user. Can be 'user', 'projectManager', or 'admin'.
 * @property {string} phoneNumber - The phone number of the user.
 * @property {string} secondaryEmail - The secondary email address of the user.
 * @property {string[]} skills - The skills of the user.
 * @property {string} biography - The biography of the user.
 * @property {string} profileImage - The path to the user's profile image.
 * @property {Object[]} tokens - The authentication tokens associated with the user.
 * @property {string} tokens.token - The authentication token.
 * @property {string} passwordResetToken - The password reset token.
 * @property {Date} passwordResetExpires - The expiration date of the password reset token.
 */
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName:{
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'projectManager', 'admin'],
    default: 'user'
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  secondaryEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  skills: {
    type: [String],
    trim: true
  },
  biography: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String // This will store the path to the image file
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  passwordResetToken: {
      type: String
  },
  passwordResetExpires: {
      type: Date
  },
  assignedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  // Add additional user fields as needed here
});

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Instance method to generate authentication token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
