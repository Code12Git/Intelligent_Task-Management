const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  clerkId: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: { 
        type: String, 
  },
  lastName: {
        type: String, 
  },
  avatarUrl: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  collaboratingTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
