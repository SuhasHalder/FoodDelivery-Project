// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.log("❌ MongoDB connection failed:", error.message);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

console.log("👉 MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
