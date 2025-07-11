// controllers/orderController.js

const Order = require('../models/orderModel');

exports.checkout = async (req, res) => {
  try {
    const { cart, user, address, paymentMethod, total } = req.body;

    if (!cart || !user || !address || !paymentMethod || !total) {
      return res.status(400).json({ success: false, message: 'Missing order information' });
    }

    const newOrder = await Order.create({
      user,
      address,
      paymentMethod,
      items: cart,
      total,
      status: 'Placed'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder,
      total
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Order failed' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const orders = await Order.find({ 'user.email': email }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const now = new Date();
    const placedAt = new Date(order.createdAt);
    const timeDiff = now - placedAt;

    // Check if order is placed and within 1 hour
    if (order.status !== 'Placed') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    if (timeDiff > 3600000) {
      return res.status(400).json({ success: false, message: 'You can only cancel within 1 hour' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ success: false, message: 'Server error while cancelling' });
  }
};
