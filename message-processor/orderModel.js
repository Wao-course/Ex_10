const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  material: String,
  amount: Number,
  currency: String,
  price: Number,
  timestamp: Date,
  delivery: {
    first_name: String,
    last_name: String,
    address: {
      street_name: String,
      street_number: String,
      city: String,
    },
  },
});

// Define the model
const OrderModel = mongoose.model('Orders', orderSchema, 'orders');

module.exports = { OrderModel, orderSchema };
