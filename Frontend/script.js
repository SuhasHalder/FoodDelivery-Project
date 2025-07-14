// Restaurant Data
const restaurants = [
  {
    id: 1,
    name: "Veg-Momo",
    rating: 4.6,
    cuisine: "Momo Mahal, Bengali-Chinese",
    location: "Lake Market, Kolkata",
    deliveryTime: "20 min",
    price: "₹220 for one",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Burger",
    rating: 4.2,
    cuisine: "Burger Hub, Fast Food",
    location: "Karunamoyee",
    deliveryTime: "25 min",
    price: "₹150 for one",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Cheese Pizza",
    rating: 4.7,
    cuisine: "Pizza Palace, Italian",
    location: "Central Park, Salt Lake",
    deliveryTime: "35 min",
    price: "₹250 for one",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Sushi",
    rating: 4.4,
    cuisine: "Sushi Corner, Japanese",
    location: "New Town, Kolkata",
    deliveryTime: "40 min",
    price: "₹350 for one",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Chicken Wings",
    rating: 4.1,
    cuisine: "Chinese Wok, Chinese",
    location: "City Centre, Kolkata",
    deliveryTime: "30 min",
    price: "₹180 for one",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Korean rice cakes",
    rating: 4.5,
    cuisine: "Korean Food",
    location: "Esplanade, Kolkata",
    deliveryTime: "30 min",
    price: "₹200 for one",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=400&q=80"
    }
];


// Cart functionality
let cart = [];
let currentUser = null;
let allOrders = [];
let ordersShown = 0;
const ORDERS_PER_PAGE = 4;

// DOM Elements
const restaurantsContainer = document.getElementById('restaurants-container');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cartBtn = document.getElementById('cart-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const cartModal = document.getElementById('cart-modal');
const closeBtns = document.querySelectorAll('.close');
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');
const loginSubmit = document.getElementById('login-submit');
const signupSubmit = document.getElementById('signup-submit');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');

const accountSection = document.getElementById('account-section');
const accountDetails = document.getElementById('account-details');
const orderHistory = document.getElementById('order-history');

const sidebar = document.getElementById('user-sidebar');
const sidebarUsername = document.getElementById('user-sidebar-user-name');


// Initialize the app
function init() {
  renderRestaurants();
  setupEventListeners();
  updateCartCount();
}

function toggleSidebar() {
  sidebar.classList.toggle('open');
}


function updateAuthState() {
  if (currentUser) {
    loginBtn.textContent = currentUser.name || 'My Account';
    signupBtn.style.display = 'none';

    loginBtn.onclick = () => {
      sidebarUsername.textContent = currentUser.name;
      toggleSidebar();
    };
  }
}

function goHome() {
  window.scrollTo(0, 0);
  sidebar.classList.remove('open');
}

function showOrders() {
  showAccount(); // Your existing function
  window.scrollTo(0, accountSection.offsetTop);
  sidebar.classList.remove('open');
}

function showAccountDetails() {
  accountSection.style.display = 'block';
  cartModal.style.display = 'none';
  loginModal.style.display = 'none';
  signupModal.style.display = 'none';
  orderHistory.innerHTML = ''; // Hide orders
  sidebar.classList.remove('open');
}

function signOut() {
  currentUser = null;
  loginBtn.textContent = 'Login';
  signupBtn.style.display = 'inline-block';
  sidebar.classList.remove('open');
  showNotification('Logged out successfully');
  accountSection.style.display = 'none';
}

function showAccount() {
  accountSection.style.display = 'block';
  loginModal.style.display = 'none';
  signupModal.style.display = 'none';
  cartModal.style.display = 'none';

  accountDetails.innerHTML = `
    <p><strong>Name:</strong> ${currentUser.name}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
  `;

  fetch('http://localhost:5000/api/v1/orders/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: currentUser.email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.orders.length) {
      allOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
      ordersShown = 0;

      orderHistory.innerHTML = ''; // Clear previous orders

      // Add the container and see-more button only once
      const wrapper = document.createElement('div');
      wrapper.id = 'order-wrapper';

      const orderList = document.createElement('div');
      orderList.id = 'order-list';
      wrapper.appendChild(orderList);

      const seeMoreBtn = document.createElement('button');
      seeMoreBtn.id = 'see-more-orders';
      seeMoreBtn.className = 'btn btn-outline';
      seeMoreBtn.style.marginTop = '15px';
      seeMoreBtn.textContent = 'See More Orders';
      seeMoreBtn.onclick = renderOrderBatch;
      wrapper.appendChild(seeMoreBtn);

      orderHistory.appendChild(wrapper);

      renderOrderBatch(); // Show first 4
    } else {
      orderHistory.innerHTML = `<p>No orders found.</p>`;
    }
  })
  .catch(err => {
    orderHistory.innerHTML = `<p>Error loading orders</p>`;
    console.error(err);
  });

  sidebar.classList.remove('active'); // Close sidebar
}

function renderOrderBatch() {
  const ORDER_LIMIT = 4;
  const orderList = document.getElementById('order-list');
  const seeMoreBtn = document.getElementById('see-more-orders');

  const remaining = allOrders.length - ordersShown;
  const nextBatch = allOrders.slice(ordersShown, ordersShown + ORDER_LIMIT);

  nextBatch.forEach(order => {
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const diffInMs = now - orderTime;
    const canCancel = (order.status === 'Placed') && (diffInMs <= 3600000); // 1 hour

    const orderDiv = document.createElement('div');
    orderDiv.style.cssText = 'padding: 15px; border: 1px solid #ddd; margin-bottom: 15px; border-radius: 8px;';
    orderDiv.innerHTML = `
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Items:</strong> ${order.items.map(i => i.name + ' (x' + i.quantity + ')').join(', ')}</p>
      ${canCancel ? `<button class="btn btn-clear" onclick="cancelOrder('${order._id}')">Cancel Order</button>` : ''}
    `;

    orderList.appendChild(orderDiv);
  });

  ordersShown += ORDER_LIMIT;

  // If all orders loaded, remove the button
  if (ordersShown >= allOrders.length && seeMoreBtn) {
    seeMoreBtn.remove();
  }
}

function cancelOrder(orderId) {
  fetch('http://localhost:5000/api/v1/orders/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  })
    .then(res => res.json())
    .then(data => {
      showNotification(data.message);
      if (data.success) {
        showAccount(); // Refresh orders
      }
    })
    .catch(err => {
      console.error(err);
      showNotification('Error cancelling order');
    });
}

// Render restaurants to the page
function renderRestaurants() {
  restaurantsContainer.innerHTML = '';
  restaurants.forEach(restaurant => {
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant-card';
    restaurantCard.innerHTML = `
      <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-img">
      <div class="restaurant-info">
        <div class="restaurant-header">
          <div class="restaurant-name">${restaurant.name}</div>
          <div class="rating">
            <i class="fas fa-star"></i> ${restaurant.rating}
          </div>
        </div>
        <div class="cuisine">
          <i class="fas fa-utensils"></i> ${restaurant.cuisine}
        </div>
        <div class="location">
          <i class="fas fa-map-marker-alt"></i> ${restaurant.location}
        </div>
        <div class="price">
          ${restaurant.price} • ${restaurant.deliveryTime}
        </div>
        <button class="btn btn-signup" data-id="${restaurant.id}" style="margin-top: 15px; width: 100%">
          <i class="fas fa-plus"></i> Add to Cart
        </button>
      </div>
    `;
    restaurantsContainer.appendChild(restaurantCard);
  });
  // Add event listeners to add-to-cart buttons
  document.querySelectorAll('[data-id]').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      addToCart(id);
    });
  });
}


// Add item to cart
function addToCart(id) {
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) return;
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: restaurant.id,
      name: restaurant.name,
      price: parseInt(restaurant.price.replace(/\D/g, '')),
      quantity: 1
    });
  }
  updateCartCount();
  showNotification(`${restaurant.name} added to cart!`);
}

// Update cart count display
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Render cart items
function renderCartItems() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
    return;
  }
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">₹${item.price * item.quantity}</div>
      </div>
      <div class="item-quantity">
        <button class="decrease" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="increase" data-id="${item.id}">+</button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });
  // Add event listeners to quantity buttons
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      updateQuantity(id, -1);
    });
  });
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      updateQuantity(id, 1);
    });
  });
  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `₹${total}`;
}

// Update item quantity in cart
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }
  updateCartCount();
  renderCartItems();
}

// Setup event listeners
function setupEventListeners() {
  // Modal toggles
  cartBtn.addEventListener('click', () => {
    renderCartItems();
    cartModal.style.display = 'flex';
  });

  loginBtn.addEventListener('click', () => {
  if (currentUser) {
    sidebarUsername.textContent = currentUser.name;
    sidebar.classList.add('open'); // show sidebar
  } else {
    loginModal.style.display = 'flex';
  }
  });

  signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'flex';
  });
  // Close modals
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      signupModal.style.display = 'none';
      cartModal.style.display = 'none';
    });
  });
  // Switch between auth modals
  goToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
  });
  goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
  });
  // Search functionality
  searchBtn.addEventListener('click', searchRestaurants);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchRestaurants();
  });
  // Auth form submissions
  loginSubmit.addEventListener('click', loginUser);
  signupSubmit.addEventListener('click', signupUser);
  // Cart actions
  clearCartBtn.addEventListener('click', clearCart);
  checkoutBtn.addEventListener('click', checkout);
}

// Search restaurants
function searchRestaurants() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    renderRestaurants();
    return;
  }
  const filtered = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(query) || 
    restaurant.cuisine.toLowerCase().includes(query) ||
    restaurant.location.toLowerCase().includes(query)
  );
  if (filtered.length === 0) {
    restaurantsContainer.innerHTML = `
      <div style="text-align: center; grid-column: 1 / -1; padding: 40px;">
        <h3>No restaurants found</h3>
        <p>Try a different search term</p>
      </div>
    `;
    return;
  }
  restaurantsContainer.innerHTML = '';
  filtered.forEach(restaurant => {
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant-card';
    restaurantCard.innerHTML = `
      <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-img">
      <div class="restaurant-info">
        <div class="restaurant-header">
          <div class="restaurant-name">${restaurant.name}</div>
          <div class="rating">
            <i class="fas fa-star"></i> ${restaurant.rating}
          </div>
        </div>
        <div class="cuisine">
          <i class="fas fa-utensils"></i> ${restaurant.cuisine}
        </div>
        <div class="location">
          <i class="fas fa-map-marker-alt"></i> ${restaurant.location}
        </div>
        <div class="price">
          ${restaurant.price} • ${restaurant.deliveryTime}
        </div>
        <button class="btn btn-signup" data-id="${restaurant.id}" style="margin-top: 15px; width: 100%">
          <i class="fas fa-plus"></i> Add to Cart
        </button>
      </div>
    `;
    restaurantsContainer.appendChild(restaurantCard);
  });
  // Reattach event listeners to add-to-cart buttons
  document.querySelectorAll('[data-id]').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

// Login user
function loginUser() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showNotification('Please fill in all fields');
    return;
  }

  fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', //Required if backend sets cookies
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();
      console.log("Full Login Response:", data);
      console.log("HTTP Status:", res.status);

      if (!res.ok || !data.success) {
        console.error("Login backend error:", data.message);
        showNotification(data.message || 'Login failed');
        return;
      }

      currentUser = data.data.user;
      showNotification('Login successful!');
      loginModal.style.display = 'none';
      updateAuthState();
    })
    .catch(err => {
      console.error('Login fetch error:', err);
      showNotification('Network or server error');
    });
}

// Signup user
function signupUser() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (!name || !email || !phone || !password || !confirm) {
    showNotification('Please fill in all fields');
    return;
  }

  if (password !== confirm) {
    showNotification('Passwords do not match');
    return;
  }

  fetch('http://localhost:5000/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // This is REQUIRED if your backend sends cookies
    body: JSON.stringify({ name, email, phone, password })
  })
    .then(async res => {
      const data = await res.json();
      console.log("Full Signup Response:", data);
      console.log("HTTP Status:", res.status);

      if (!res.ok || !data.success) {
        // Log and show backend error
        console.error("Signup backend error:", data.message);
        showNotification(data.message || 'Signup failed');
        return;
      }

      currentUser = data.data.user;
      showNotification('Account created successfully!');
      signupModal.style.display = 'none';
      updateAuthState();
    })
    .catch(err => {
      console.error('Signup fetch error:', err);
      showNotification('Network or server error');
    });
}

// Update authentication state
function updateAuthState() {
  if (currentUser) {
    loginBtn.textContent = currentUser.name || 'My Account';
    signupBtn.style.display = 'none';
    loginBtn.onclick = showAccount;
  }
}


// Clear cart
function clearCart() {
  cart = [];
  updateCartCount();
  renderCartItems();
  showNotification('Cart cleared');
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty');
    return;
  }
  if (!currentUser) {
    showNotification('Please login to complete your order');
    loginModal.style.display = 'flex';
    cartModal.style.display = 'none';
    return;
  }

  cartModal.style.display = 'none';
  document.getElementById('location-modal').style.display = 'flex';
}

// I add a new function

let userAddress = '';

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function saveAddress() {
  const address = document.getElementById('address-line').value.trim();
  if (!address) {
    showNotification('Please enter address');
    return;
  }
  userAddress = address;
  document.getElementById('location-modal').style.display = 'none';
  showOrderSummary();
}

function showOrderSummary() {
  document.getElementById('summary-items').innerHTML = cart.map(item =>
    `<p>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</p>`
  ).join('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('summary-total').textContent = total;
  document.getElementById('summary-modal').style.display = 'flex';
}

function goToPayment() {
  document.getElementById('summary-modal').style.display = 'none';
  document.getElementById('payment-modal').style.display = 'flex';
}

function completePayment(method) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  fetch('http://localhost:5000/api/v1/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cart,
      user: currentUser,
      address: userAddress,
      paymentMethod: method,
      total
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification(`Order placed via ${method}! Total ₹${data.total || total}`);
        cart = [];
        updateCartCount();
        document.getElementById('payment-modal').style.display = 'none';
      } else {
        showNotification('Payment failed');
      }
    })
    .catch(err => {
      console.error(err);
      showNotification('Payment error');
    });
}

function autoDetectLocation() {
  if (!navigator.geolocation) {
    showNotification('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });

  function success(position) {
    const { latitude, longitude } = position.coords;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          document.getElementById('address-line').value = data.display_name;
          showNotification('Location detected!');
        } else {
          showNotification('Failed to get address from coordinates');
        }
      })
      .catch(err => {
        console.error(err);
        showNotification('Error fetching location info');
      });
  }

  function error(err) {
    console.error(err);
    showNotification('Failed to get location: ' + err.message);
  }
}

function goBackFrom(buttonElement) {
  const modal = buttonElement.closest('.modal'); // get current modal

  if (!modal) return;

  modal.style.display = 'none';

  // Check which modal it is and go to previous step
  if (modal.id === 'summary-modal') {
    document.getElementById('location-modal').style.display = 'flex';
  } else if (modal.id === 'payment-modal') {
    document.getElementById('summary-modal').style.display = 'flex';
  } else if (modal.id === 'location-modal') {
    cartModal.style.display = 'flex';
  }
}


// Get all necessary DOM elements
const chatbotBtn = document.getElementById('chatbot-button');
const chatWindow = document.getElementById('chat-window');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

// Show chatbot window when user clicks on the floating button
chatbotBtn.addEventListener('click', () => {
  chatWindow.style.display = 'flex';
});
// Close chatbot window when user clicks on the close (X) button
closeBtn.addEventListener('click', () => {
  chatWindow.style.display = 'none';
});
// Main function to handle sending the user's message
async function handleSendMessage() {
  const userMessage = chatInput.value.trim(); // Get input text and trim spaces
  if (!userMessage) return; // If empty, do nothing

  // Show user's message immediately in the chat
  appendMessage("You", userMessage, "user-message");

  chatInput.value = ""; // Clear the input box

  // Simulate typing delay (e.g. 1 second) before bot replies
  setTimeout(async () => {
    try {
      // Send the user's message to backend API
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json(); // Parse backend response

      // Show chatbot's reply in the chat
      appendMessage("Bot", data.reply, "bot-message");
    } catch (err) {
      // Show error if backend not reachable
      appendMessage("Bot", "Error connecting to chatbot server.", "bot-message");
      console.error("Chatbot fetch error:", err);
    }
  }, 1000); // 1000ms = 1 second delay
}
// Event listener for Send Button click
sendBtn.addEventListener('click', handleSendMessage);
// Event listener for Enter key press (inside chat input box)
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent default form submission or line break
    handleSendMessage(); // Call the same function as Send button
  }
});
// Function to append messages to the chat window
function appendMessage(sender, message, className) {
  const msg = document.createElement("div");
  msg.classList.add("message", className); // Add styles (user/bot)
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`; // Show who said it
  chatBody.appendChild(msg); // Add to chat area
  chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to bottom
}




document.addEventListener('DOMContentLoaded', init);
