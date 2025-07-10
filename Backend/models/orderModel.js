const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
  },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  total: Number,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
