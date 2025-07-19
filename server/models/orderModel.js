// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   user: {
//     name: String,
//     email: String,
//   },
//   items: [
//     {
//       id: Number,
//       name: String,
//       price: Number,
//       quantity: Number,
//     }
//   ],
//   total: Number,
//   status: {
//     type: String,
//     default: "Pending"
//   }
// }, { timestamps: true });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
  },
  address: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
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
    default: "Placed"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
