const mongoose = require('mongoose');




const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  shippingAddress: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    isEmpty: { type: Boolean, default: true }
  },


}, { timestamps: true });



const User = mongoose.model('User', userSchema);
module.exports = User;

