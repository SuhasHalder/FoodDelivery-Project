const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;

  console.log("User message:", message); // Debug

  let reply = "Sorry, I didn't understand that.";

  if (!message) {
    return res.json({ reply: "Please type something." });
  }

  const msg = message.toLowerCase();

  if (msg.includes("hi") || msg.includes("hello")) {
    reply = "Hello! How can I help you today?";
  } else if (msg.includes("order")) {
    reply = "You can explore our menu and place an order!";
  } else if (msg.includes("thanks") || msg.includes("thank")) {
    reply = "You're welcome!";
  }

  res.json({ reply });
});

module.exports = router;
