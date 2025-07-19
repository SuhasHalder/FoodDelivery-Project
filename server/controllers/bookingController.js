const Order= require("../models/Order");
const catchAsync = require("../utils/catchAsync");

exports.createBooking = catchAsync(async (req, res, next) => {
  // const newBooking = await Booking.create(req.body);
  const newBooking = await Booking.create({
    user :req.user._id,
    tour :req.body.food,
  });
  res.status(201).json({
    status : "success",
    message : "Booking created Successfully",
    data: newBooking 
  });
});