//parent referencing.

const mongoose = require("mongoose");

const orderSchema= mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  food : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Food",
  }
})

const Order = mongoose.model("Booking",orderSchema);

module.exports = Order;