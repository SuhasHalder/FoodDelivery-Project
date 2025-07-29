# FoodDelivery-Project
A full-stack food delivery web application built using **Node.js**, **Express**, and **MongoDB** for the backend, and **HTML**, **CSS**, and **JavaScript** for the frontend. The platform enables users to browse food items, make bookings, place orders, and interact with a responsive user interface.

---

## 📁 Project Structure

```
FoodDelivery-Project/
│
├── client/                         # Frontend files
│   ├── index.html                  # Homepage for food delivery
│   ├── info.html                   # Informational or details page
│   ├── style.css                   # Main styles
│   ├── info-style.css              # Info page specific styles
│   └── script.js                   # Frontend logic (cart, requests)
│
├── server/                         # Backend folder
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│
│   ├── controllers/                # Route logic handlers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   └── errorController.js
│
│   ├── models/                     # Mongoose schemas
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── orderModel.js
│   │   └── User.js
│
│   ├── routes/                     # API endpoints
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── foodRoutes.js
│   │   └── orderRoutes.js
│
│   ├── utils/                      # Utility functions
│   │   ├── appError.js
│   │   └── catchAsync.js
│
│   ├── server.js                   # Server entry point
│   └── .env                        # Environment variables (not committed)
│
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json                     # Deployment configuration (e.g., Vercel)
└── README.md
```

---

## ✨ Features

* 🔐 **User Authentication**: Signup, login, session/token-based authentication
* 🍱 **Food Listing**: Display food items from various restaurants
* 🛒 **Cart & Orders**: Add items to cart, place orders
* 📅 **Booking System**: Book a table or delivery slot
* 💬 **Chat Module**: Chat functionality for customer support (via `chatRoutes.js`)
* ⚙️ **Admin Support** (extendable): Admins can manage orders, food listings, etc.
* 🌐 **Frontend**: Responsive design using HTML, CSS, and JS

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd FoodDelivery-Project
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Create `.env` File

Inside `server/`, create a `.env` file with the following values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Start the Server

```bash
npm run dev     # For development
npm start       # For production
```

---

### 5. Run the Frontend

Simply open the `index.html` file located in the `client/` folder in your browser.
(Optional: Use Live Server extension in VS Code for a better experience.)

---

## 🔌 API Endpoints Overview

### Auth Routes

* `POST /api/v1/auth/signup` — Create new user
* `POST /api/v1/auth/login` — User login

### Food Routes

* `GET /api/v1/foods` — Get all food items
* `GET /api/v1/foods/:id` — Get food item by ID
* `POST /api/v1/foods` — Add food (admin only)

### Booking Routes

* `POST /api/v1/bookings` — Book a table or slot
* `GET /api/v1/bookings` — Get user bookings

### Order Routes

* `POST /api/v1/orders` — Place new order
* `GET /api/v1/orders/myOrders` — Get user orders
* `GET /api/v1/orders` — Admin: get all orders
* `PATCH /api/v1/orders/:id/status` — Update order status

### Chat Routes

* `POST /api/v1/chat` — Start a chat (optional)
* `GET /api/v1/chat/history` — Get chat history

## 🧠 Models Overview

### User
* `name`, `email`, `password`

### Food
* `name`, `description`, `price`, `image`, `category`

### Order
* `user`, `items`, `totalAmount`, `status`

## 🧰 Utilities & Middleware

* **appError.js** — Custom error handling
* **catchAsync.js** — Async error wrapper
* **authMiddleware.js** — Protect routes

## 🔐 Security & Best Practices

* Passwords hashed using bcrypt
* JWT authentication system
* Environment variables hidden via `.env`
* Input validation and error sanitization
* CORS and Helmet enabled (recommended for production)

## 🚀 Deployment

This project includes a `vercel.json` file, indicating support for **Vercel deployment**.
You can easily deploy the backend via Vercel.

## 📌 Future Improvements

*  Payment gateway integration (e.g., Razorpay/Stripe)
*  Persistent cart storage via MongoDB
*  Admin dashboard UI
*  Real-time order tracking using WebSockets
*  User chat with delivery partner
