const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');


const morgan = require("morgan")
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT;

connectDB();

app.use(cors({                 //for frontend & backend connection.)
  origin : ["http://localhost:5500", "http://127.0.0.1:5500", "https://deailyfood-food-delivery.netlify.app"],
  credentials : true,
}));
  
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use("/api/chat", chatRoutes);

app.get('/',(req,res)=>{
  res.send({
    activeStatus: true,
    error: false,
  })
})

const globalErrorHandler = require('./controllers/errorController');
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
