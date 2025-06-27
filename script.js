class StorageService {
  constructor() {
    this.tailorsKey = 'tailors';
    this.bookingsKey = 'bookings';
    this.usersKey = 'users';
    if (!localStorage.getItem(this.tailorsKey)) {
      localStorage.setItem(this.tailorsKey, JSON.stringify([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@tailorfind.com',
          address: '123 Main St, Mumbai',
          mobile: '+919876543210',
          specialties: ['Alterations', 'Custom Suits'],
          experience: 5,
          rating: 4.5,
          description: 'Expert tailor with a passion for quality.',
          priceRange: { min: 500, max: 5000 },
          workingHours: { start: '09:00', end: '18:00' },
          isAvailable: true,
          reviews: [],
          totalBookings: 0,
          completedBookings: 0,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          certifications: [],
          portfolio: [],
          socialMedia: {},
        }
      ]));
    }
    if (!localStorage.getItem(this.bookingsKey)) {
      localStorage.setItem(this.bookingsKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify([]));
    }
  }

  getTailors() {
    return JSON.parse(localStorage.getItem(this.tailorsKey) || '[]');
  }

  addTailor(tailor) {
    const tailors = this.getTailors();
    tailors.push(tailor);
    localStorage.setItem(this.tailorsKey, JSON.stringify(tailors));
  }

  updateTailor(id, data) {
    const tailors = this.getTailors();
    const index = tailors.findIndex(t => t.id === id);
    if (index !== -1) {
      tailors[index] = { ...tailors[index], ...data };
      localStorage.setItem(this.tailorsKey, JSON.stringify(tailors));
    }
  }

  getTailorByEmail(email) {
    return this.getTailors().find(t => t.email === email) || null;
  }

  getBookingsByTailorId(tailorId) {
    return JSON.parse(localStorage.getItem(this.bookingsKey) || '[]').filter(b => b.tailorId === tailorId);
  }

  addBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem(this.bookingsKey) || '[]');
    bookings.push(booking);
    localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
  }

  updateBooking(id, data) {
    const bookings = JSON.parse(localStorage.getItem(this.bookingsKey) || '[]');
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...data };
      localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
    }
  }

  getUserByEmail(email) {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]').find(u => u.email === email);
  }

  addUser(user) {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
}

const storageService = new StorageService();

// State Management
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let currentTailor = currentUser ? storageService.getTailorByEmail(currentUser.email) : null;
let currentBookingTailorId = null;

// Dynamic Date/Time
function updateDateTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long'
  };
  const formattedDateTime = now.toLocaleString('en-US', options).replace(',', '');
  document.getElementById('current-date-time').textContent = formattedDateTime;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Navigation
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  if (sectionId === 'search') {
    searchTailors();
  } else if (sectionId === 'dashboard' && currentUser && currentUser.role === 'tailor') {
    displayDashboard();
  }
}

// Advanced Search
function searchTailors() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const specialty = document.getElementById('specialty-filter').value;
  const location = document.getElementById('location-filter').value;
  const rating = document.getElementById('rating-filter').value;
  const price = document.getElementById('price-filter').value;
  const tailors = storageService.getTailors();
  const filteredTailors = tailors.filter(t => {
    const matchesQuery = t.name.toLowerCase().includes(query) || 
                        t.specialties.some(s => s.toLowerCase().includes(query)) ||
                        t.address.toLowerCase().includes(query);
    const matchesSpecialty = !specialty || t.specialties.includes(specialty);
    const matchesLocation = !location || t.address.includes(location);
    const matchesRating = !rating || t.rating >= parseFloat(rating);
    const matchesPrice = !price || (
      price === 'budget' && t.priceRange.max <= 1500 ||
      price === 'midrange' && t.priceRange.min >= 1500 && t.priceRange.max <= 3000 ||
      price === 'premium' && t.priceRange.min >= 3000
    );
    return matchesQuery && matchesSpecialty && matchesLocation && matchesRating && matchesPrice;
  });
  displayTailors(filteredTailors);
}

function displayTailors(tailors = storageService.getTailors()) {
  const grid = document.getElementById('tailor-grid');
  grid.innerHTML = '';
  tailors.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tailor-card';
    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>Specialties: ${t.specialties.join(', ')}</p>
      <p>Location: ${t.address}</p>
      <p>Experience: ${t.experience} years | Rating: ${t.rating}/5</p>
      <p>Price: ₹${t.priceRange.min} - ₹${t.priceRange.max}</p>
      <p>Status: ${t.isAvailable ? '<span style="color: green;">Available</span>' : '<span style="color: red;">Unavailable</span>'}</p>
      <button class="btn" onclick="openBookingModal('${t.id}')">Book Now</button>
      <button class="btn btn-secondary" onclick="openReviewModal('${t.id}')">Submit Review</button>
    `;
    grid.appendChild(card);
  });
}

// Modals
function openBookingModal(tailorId) {
  currentBookingTailorId = tailorId;
  const modal = document.getElementById('booking-modal');
  const serviceSelect = document.getElementById('booking-service');
  const tailor = storageService.getTailors().find(t => t.id === tailorId);
  serviceSelect.innerHTML = '<option value="">Select a service</option>';
  tailor.specialties.forEach(s => {
    const option = document.createElement('option');
    option.value = s;
    option.textContent = s;
    serviceSelect.appendChild(option);
  });
  modal.style.display = 'flex';
}

function openReviewModal(tailorId) {
  currentBookingTailorId = tailorId;
  document.getElementById('review-modal').style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Form Validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?\d{10,}$/.test(phone);
}

function validateFormField(fieldId, errorId, validationFn, errorMessage) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  const isValid = validationFn(field.value);
  error.textContent = isValid ? '' : errorMessage;
  return isValid;
}

// Form Handling
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const mobile = document.getElementById('reg-mobile').value;
  const address = document.getElementById('reg-address').value;
  const specialties = document.getElementById('reg-specialties').value.split(',').map(s => s.trim());
  const experience = parseInt(document.getElementById('reg-experience').value);

  let isValid = true;
  isValid &= validateFormField('reg-name', 'reg-name-error', val => val.trim().length > 0, 'Name is required');
  isValid &= validateFormField('reg-email', 'reg-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('reg-password', 'reg-password-error', val => val.length >= 6, 'Password must be at least 6 characters');
  isValid &= validateFormField('reg-mobile', 'reg-mobile-error', validatePhone, 'Invalid mobile number');

  if (!isValid) return;

  if (storageService.getUserByEmail(email)) {
    document.getElementById('reg-email-error').textContent = 'Email already registered';
    return;
  }

  const user = { id: Date.now().toString(), email, password, name, role: 'tailor' };
  const tailor = {
    id: user.id,
    name,
    email,
    address,
    mobile,
    specialties,
    experience,
    rating: 0,
    description: '',
    priceRange: { min: 500, max: 5000 },
    workingHours: { start: '09:00', end: '18:00' },
    isAvailable: true,
    reviews: [],
    totalBookings: 0,
    completedBookings: 0,
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    certifications: [],
    portfolio: [],
    socialMedia: {},
  };

  storageService.addUser(user);
  storageService.addTailor(tailor);
  localStorage.setItem('user', JSON.stringify(user));
  currentUser = user;
  currentTailor = tailor;
  updateNav();
  showSection('dashboard');
});

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  let isValid = true;
  isValid &= validateFormField('login-email', 'login-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('login-password', 'login-password-error', val => val.length >= 6, 'Password must be at least 6 characters');

  if (!isValid) return;

  const user = storageService.getUserByEmail(email);
  if (!user) {
    document.getElementById('login-email-error').textContent = 'User not found';
    return;
  }
  if (user.password !== password) {
    document.getElementById('login-password-error').textContent = 'Incorrect password';
    return;
  }

  localStorage.setItem('user', JSON.stringify(user));
  currentUser = user;
  currentTailor = storageService.getTailorByEmail(email);
  updateNav();
  closeModal('login-modal');
  if (user.role === 'tailor') {
    showSection('dashboard');
  } else {
    showSection('search');
  }
});

document.getElementById('booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const booking = {
    id: Date.now().toString(),
    tailorId: currentBookingTailorId,
    customerName: document.getElementById('booking-name').value,
    customerEmail: document.getElementById('booking-email').value,
    customerMobile: document.getElementById('booking-mobile').value,
    serviceType: document.getElementById('booking-service').value,
    preferredDate: document.getElementById('booking-date').value,
    description: document.getElementById('booking-description').value,
    status: 'pending',
  };

  let isValid = true;
  isValid &= validateFormField('booking-name', 'booking-name-error', val => val.trim().length > 0, 'Name is required');
  isValid &= validateFormField('booking-email', 'booking-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('booking-mobile', 'booking-mobile-error', validatePhone, 'Invalid mobile number');

  if (!isValid) return;

  storageService.addBooking(booking);
  storageService.updateTailor(currentBookingTailorId, {
    totalBookings: storageService.getBookingsByTailorId(currentBookingTailorId).length
  });
  closeModal('booking-modal');
  alert('Booking submitted successfully!');
});

document.getElementById('review-form').addEventListener('submit', e => {
  e.preventDefault();
  const review = {
    id: Date.now().toString(),
    tailorId: currentBookingTailorId,
    rating: parseInt(document.getElementById('review-rating').value),
    comment: document.getElementById('review-comment').value,
    date: new Date().toISOString(),
  };
  const tailor = storageService.getTailors().find(t => t.id === currentBookingTailorId);
  tailor.reviews.push(review);
  const avgRating = tailor.reviews.reduce((sum, r) => sum + r.rating, 0) / tailor.reviews.length;
  storageService.updateTailor(currentBookingTailorId, { reviews: tailor.reviews, rating: avgRating });
  closeModal('review-modal');
  alert('Review submitted successfully!');
});

document.getElementById('profile-form').addEventListener('submit', e => {
  e.preventDefault();
  const updatedTailor = {
    name: document.getElementById('profile-name').value,
    address: document.getElementById('profile-address').value,
    mobile: document.getElementById('profile-mobile').value,
    specialties: document.getElementById('profile-specialties').value.split(',').map(s => s.trim()),
    isAvailable: document.getElementById('profile-availability').checked,
    lastActive: new Date().toISOString(),
  };
  storageService.updateTailor(currentTailor.id, updatedTailor);
  current祸

System: currentTailor = { ...currentTailor, ...updatedTailor };
  alert('Profile updated successfully!');
});

// Portfolio Management
function addPortfolioItem() {
  const fileInput = document.getElementById('portfolio-image');
  const title = document.getElementById('portfolio-title').value;
  const file = fileInput.files[0];
  if (!file || !title) {
    alert('Please select an image and provide a title');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const portfolioItem = {
      id: Date.now().toString(),
      title,
      image: e.target.result,
    };
    currentTailor.portfolio.push(portfolioItem);
    storageService.updateTailor(currentTailor.id, { portfolio: currentTailor.portfolio });
    displayPortfolio();
    fileInput.value = '';
    document.getElementById('portfolio-title').value = '';
  };
  reader.readAsDataURL(file);
}

function displayPortfolio() {
  const portfolioList = document.getElementById('portfolio-list');
  portfolioList.innerHTML = '';
  currentTailor.portfolio.forEach(item => {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <p>${item.title}</p>
    `;
    portfolioList.appendChild(div);
  });
}

// Dashboard
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
  document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
  document.getElementById(`${tabId}-tab`).style.display = 'block';
  if (tabId === 'bookings') {
    displayBookings();
  } else if (tabId === 'portfolio') {
    displayPortfolio();
  } else if (tabId === 'reviews') {
    displayReviews();
  } else if (tabId === 'analytics') {
    displayAnalytics();
  }
}

function displayDashboard() {
  document.getElementById('profile-name').value = currentTailor.name;
  document.getElementById('profile-address').value = currentTailor.address;
  document.getElementById('profile-mobile').value = currentTailor.mobile;
  document.getElementById('profile-specialties').value = currentTailor.specialties.join(', ');
  document.getElementById('profile-availability').checked = currentTailor.isAvailable;
  showTab('profile');
}

function displayBookings() {
  const bookingsList = document.getElementById('bookings-list');
  const bookings = storageService.getBookingsByTailorId(currentTailor.id);
  bookingsList.innerHTML = '';
  bookings.forEach(b => {
    const div = document.createElement('div');
    div.className = 'tailor-card';
    div.innerHTML = `
      <p><strong>Customer:</strong> ${b.customerName}</p>
      <p><strong>Service:</strong> ${b.serviceType}</p>
      <p><strong>Date:</strong> ${b.preferredDate}</p>
      <p><strong>Status:</strong> ${b.status}</p>
      ${b.status === 'pending' ? `
        <button class="btn" onclick="handleBooking('${b.id}', 'accept')">Accept</button>
        <button class="btn btn-secondary" onclick="handleBooking('${b.id}', 'reject')">Reject</button>
      ` : b.status === 'accepted' ? `
        <button class="btn" onclick="handleBooking('${b.id}', 'complete')">Complete</button>
      ` : ''}
    `;
    bookingsList.appendChild(div);
  });
}

function displayReviews() {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = '';
  currentTailor.reviews.forEach(r => {
    const div = document.createElement('div');
    div.className = 'tailor-card';
    div.innerHTML = `
      <p><strong>Rating:</strong> ${r.rating}/5</p>
      <p><strong>Comment:</strong> ${r.comment}</p>
      <p><strong>Date:</strong> ${new Date(r.date).toLocaleDateString()}</p>
    `;
    reviewsList.appendChild(div);
  });
}

function handleBooking(bookingId, action) {
  const status = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'completed';
  storageService.updateBooking(bookingId, { status });
  if (action === 'complete') {
    storageService.updateTailor(currentTailor.id, {
      completedBookings: currentTailor.completedBookings + 1
    });
    currentTailor.completedBookings += 1;
  }
  displayBookings();
}

function displayAnalytics() {
  document.getElementById('total-bookings').textContent = currentTailor.totalBookings;
  document.getElementById('completed-bookings').textContent = currentTailor.completedBookings;
  document.getElementById('total-revenue').textContent = `₹${currentTailor.completedBookings * 2500}`;
  const ctx = document.getElementById('bookings-chart').getContext('2d');
  const bookings = storageService.getBookingsByTailorId(currentTailor.id);
  const dates = [...new Set(bookings.map(b => b.preferredDate))].sort();
  const data = dates.map(date => bookings.filter(b => b.preferredDate === date && b.status === 'completed').length);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Completed Bookings',
        data: data,
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        fill: true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Authentication
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

function logout() {
  localStorage.removeItem('user');
  currentUser = null;
  currentTailor = null;
  updateNav();
  showSection('home');
}

function updateNav() {
  document.getElementById('login-link').style.display = currentUser ? 'none' : 'list-item';
  document.getElementById('logout-link').style.display = currentUser ? 'list-item' : 'none';
  document.getElementById('dashboard-link').style.display = currentUser && currentUser.role === 'tailor' ? 'list-item' : 'none';
}

// Initialize
updateNav();
if (currentUser && currentUser.role === 'tailor') {
  showSection('dashboard');
} else {
  showSection('home');
}