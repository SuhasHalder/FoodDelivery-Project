const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        success: "success",
        token,
        data: {
            user
        }
    });

}

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

if (!name || !email || !phone || !password) {
  return next(new AppError("Missing required fields", 400));
}

const existingUser = await User.findOne({ email });
if (existingUser) {
  return next(new AppError("User already exists", 400));
}

const newUser = await User.create({
  name,
  email,
  phone,
  password
});

  // ADD THIS LINE TO CHECK IF PASSWORD IS HASHED
  console.log("Saved user password (should be hashed):", newUser.password);

  createSendToken(newUser, 201, res);
});



exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    return next(new AppError("Missing required fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log("User not found");
    return next(new AppError("Invalid email or password", 401));
  }

  console.log("Stored hashed password:", user.password);

  const isCorrect = await user.correctPassword(password, user.password);

  console.log("Password match result:", isCorrect);

  if (!isCorrect) {
    console.log("Password does not match");
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, 200, res);
});


exports.protect = catchAsync(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new AppError("You are not logged in",401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const currentUser = await User.findById(userId);

    if(!currentUser) {
        return next(new AppError("User not found",401));
    }
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {  //(its called factory function  for{...role}).
  return (req, res, next) => {  //return middleware function.
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you are not authorized to access this resource",403));

    }
    next();

  }
}