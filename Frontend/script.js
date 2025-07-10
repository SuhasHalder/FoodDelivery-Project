// Restaurant Data
const restaurants = [
  {
    id: 1,
    name: "Spice Delight",
    rating: 4.5,
    cuisine: "North Indian, Chinese",
    location: "Esplanade, Kolkata",
    deliveryTime: "30 min",
    price: "₹200 for one",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Burger Hub",
    rating: 4.2,
    cuisine: "Burgers, Fast Food",
    location: "Karunamoyee",
    deliveryTime: "25 min",
    price: "₹150 for one",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Pizza Palace",
    rating: 4.7,
    cuisine: "Pizzas, Italian",
    location: "Central Park, Salt Lake",
    deliveryTime: "35 min",
    price: "₹250 for one",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Sushi Corner",
    rating: 4.4,
    cuisine: "Japanese, Sushi",
    location: "New Town, Kolkata",
    deliveryTime: "40 min",
    price: "₹350 for one",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Chinese Wok",
    rating: 4.1,
    cuisine: "Chinese, Asian",
    location: "City Centre, Kolkata",
    deliveryTime: "30 min",
    price: "₹180 for one",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

// Cart functionality
let cart = [];
let currentUser = null;

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


// Initialize the app
function init() {
  renderRestaurants();
  setupEventListeners();
  updateCartCount();
}

function updateAuthState() {
  if (currentUser) {
    loginBtn.textContent = currentUser.name || 'My Account';
    signupBtn.style.display = 'none';
    loginBtn.onclick = () => showAccount();
  }
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

  // Fetch orders from backend
  fetch('http://localhost:5000/api/v1/orders/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: currentUser.email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.orders.length) {
      orderHistory.innerHTML = data.orders.map(order => `
        <div style="padding: 15px; border: 1px solid #ddd; margin-bottom: 15px; border-radius: 8px;">
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> ₹${order.total}</p>
          <p><strong>Items:</strong> ${order.items.map(i => i.name + ' (x' + i.quantity + ')').join(', ')}</p>
        </div>
      `).join('');
    } else {
      orderHistory.innerHTML = `<p>No orders found.</p>`;
    }
  })
  .catch(err => {
    orderHistory.innerHTML = `<p>Error loading orders</p>`;
    console.error(err);
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
    loginModal.style.display = 'flex';
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

// Checkout
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

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  fetch('http://localhost:5000/api/v1/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, user: currentUser })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showNotification(`Order placed! Total: ₹${data.total || total}`);
      cart = [];
      updateCartCount();
      cartModal.style.display = 'none';
    } else {
      showNotification('Checkout failed');
    }
  })
  .catch(err => {
    console.error(err);
    showNotification('Checkout error');
  });
}


// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
