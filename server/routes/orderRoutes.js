const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Save new order
router.post('/checkout', async (req, res) => {
  try {
    const { cart, user } = req.body;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = await Order.create({
      user,
      items: cart,
      total,
    });

    res.status(201).json({ success: true, message: 'Order placed', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Order failed' });
  }
});

// Fetch user orders
router.post('/user', async (req, res) => {
  try {
    const { email } = req.body;
    const orders = await Order.find({ 'user.email': email }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;



