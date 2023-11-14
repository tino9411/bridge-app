const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
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
  // Add additional user fields as needed
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
