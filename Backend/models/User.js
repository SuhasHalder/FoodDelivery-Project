const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid Email"]
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    validate: {
      validator: function (val) {
        return /^[0-9]{10}$/.test(val);  // simple 10 digit phone validation
      },
      message: "Phone number must be 10 digits"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [15, "Password must be at most 15 characters"],
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderater"],
    default: "user"
  }
});


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// Define instance method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
