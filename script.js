const apiService = {
  baseUrl: './',
  async post(endpoint, data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  async get(endpoint, params = {}) {
    const urlParams = new URLSearchParams(params);
    const response = await fetch(this.baseUrl + endpoint + (urlParams.toString() ? '?' + urlParams.toString() : ''), {
      credentials: 'same-origin'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// State Management
let currentUser = null;
let currentTailor = null;
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
async function searchTailors() {
  const query = document.getElementById('search-input').value;
  const specialty = document.getElementById('specialty-filter').value;
  const location = document.getElementById('location-filter').value;

  try {
    const params = new URLSearchParams({
      q: query,
      specialty: specialty,
      location: location
    });
    const response = await fetch(`search.php?${params}`);
    const tailors = await response.json();
    displayTailors(tailors);
  } catch (error) {
    console.error('Search failed:', error);
    displayTailors([]);
  }
}

function displayTailors(tailors = []) {
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
  // Fetch tailor to get specialties
  apiService.get('get_tailor.php', {id: tailorId}).then(tailor => {
    serviceSelect.innerHTML = '<option value="">Select a service</option>';
    tailor.specialties.forEach(s => {
      const option = document.createElement('option');
      option.value = s;
      option.textContent = s;
      serviceSelect.appendChild(option);
    });
  }).catch(error => console.error('Failed to load tailor specialties', error));
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
document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    password: document.getElementById('reg-password').value,
    confirm_password: document.getElementById('reg-confirm-password').value,
    role: document.getElementById('reg-role').value || 'tailor'
  };

  let isValid = true;
  isValid &= validateFormField('reg-name', 'reg-name-error', val => val.trim().length > 0, 'Name is required');
  isValid &= validateFormField('reg-email', 'reg-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('reg-password', 'reg-password-error', val => val.length >= 6, 'Password must be at least 6 characters');
  if (formData.password !== formData.confirm_password) {
    document.getElementById('reg-confirm-password-error').textContent = 'Passwords do not match';
    isValid = false;
  }

  if (!isValid) return;

  try {
    const result = await apiService.post('register.php', formData);
    if (result.success) {
      alert('Registration successful! Redirecting to login.');
      window.location.href = 'login.php';
    } else {
      document.getElementById('reg-email-error').textContent = result.error || 'Registration failed';
    }
  } catch (error) {
    alert('Registration error: ' + error.message);
  }
});

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };

  let isValid = true;
  isValid &= validateFormField('login-email', 'login-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('login-password', 'login-password-error', val => val.length >= 6, 'Password must be at least 6 characters');

  if (!isValid) return;

  try {
    const result = await apiService.post('login.php', formData);
    if (result.success) {
      window.location.reload(); // Reload to set session and update UI
    } else {
      document.getElementById('login-email-error').textContent = result.error || 'Login failed';
    }
  } catch (error) {
    alert('Login error: ' + error.message);
  }
});

document.getElementById('booking-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = {
    tailor_id: currentBookingTailorId,
    name: document.getElementById('booking-name').value,
    email: document.getElementById('booking-email').value,
    mobile: document.getElementById('booking-mobile').value,
    service: document.getElementById('booking-service').value,
    date: document.getElementById('booking-date').value,
    description: document.getElementById('booking-description').value
  };

  let isValid = true;
  isValid &= validateFormField('booking-name', 'booking-name-error', val => val.trim().length > 0, 'Name is required');
  isValid &= validateFormField('booking-email', 'booking-email-error', validateEmail, 'Invalid email format');
  isValid &= validateFormField('booking-mobile', 'booking-mobile-error', val => /^\+?\d{10,}$/.test(val), 'Invalid mobile number');

  if (!isValid) return;

  try {
    const result = await apiService.post('booking.php', formData);
    if (result.success) {
      closeModal('booking-modal');
      alert('Booking submitted successfully!');
    } else {
      alert('Booking error: ' + (result.error || 'Failed to submit booking'));
    }
  } catch (error) {
    alert('Booking error: ' + error.message);
  }
});

document.getElementById('review-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = {
    tailor_id: currentBookingTailorId,
    rating: document.getElementById('review-rating').value,
    comment: document.getElementById('review-comment').value
  };

  if (!formData.comment.trim()) {
    alert('Comment is required');
    return;
  }

  try {
    const result = await apiService.post('review.php', formData);
    if (result.success) {
      closeModal('review-modal');
      alert('Review submitted successfully!');
    } else {
      alert('Review error: ' + (result.error || 'Failed to submit review'));
    }
  } catch (error) {
    alert('Review error: ' + error.message);
  }
});

document.getElementById('profile-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = {
    name: document.getElementById('profile-name').value,
    address: document.getElementById('profile-address').value,
    mobile: document.getElementById('profile-mobile').value,
    specialties: document.getElementById('profile-specialties').value,
    is_available: document.getElementById('profile-availability').checked ? 1 : 0
  };

  try {
    const result = await apiService.post('profile_update.php', formData);
    if (result.success) {
      alert('Profile updated successfully!');
      // Reload dashboard data
      if (currentUser && currentUser.role === 'tailor') {
        loadDashboardData();
      }
    } else {
      alert('Profile update error: ' + (result.error || 'Failed to update profile'));
    }
  } catch (error) {
    alert('Profile update error: ' + error.message);
  }
});

// Portfolio Management
async function addPortfolioItem() {
  const fileInput = document.getElementById('portfolio-image');
  const titleInput = document.getElementById('portfolio-title');
  const title = titleInput.value.trim();
  const file = fileInput.files[0];
  if (!file || !title) {
    alert('Please select an image and provide a title');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('image', file);

  try {
    const result = await fetch('upload.php', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    const response = await result.json();
    if (response.success) {
      alert('Portfolio item added successfully!');
      fileInput.value = '';
      titleInput.value = '';
      loadDashboardData(); // Reload to show new portfolio
    } else {
      alert('Upload error: ' + (response.error || 'Failed to upload'));
    }
  } catch (error) {
    alert('Upload error: ' + error.message);
  }
}

function displayPortfolio(portfolio) {
  const portfolioList = document.getElementById('portfolio-list');
  portfolioList.innerHTML = '';
  portfolio.forEach(item => {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.innerHTML = `
      <img src="${item.imagePath}" alt="${item.title}" style="max-width: 200px;">
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

async function loadDashboardData() {
  if (!currentUser || currentUser.role !== 'tailor') return;

  try {
    const data = await apiService.get('dashboard_data.php');
    currentTailor = data.profile;
    displayBookings(data.bookings);
    displayReviews(data.reviews);
    displayPortfolio(data.portfolio);
    displayAnalytics(data.analytics);
    // Populate profile form
    document.getElementById('profile-name').value = currentTailor.name;
    document.getElementById('profile-address').value = currentTailor.address || '';
    document.getElementById('profile-mobile').value = currentTailor.mobile || '';
    document.getElementById('profile-specialties').value = currentTailor.specialties.join(', ');
    document.getElementById('profile-availability').checked = currentTailor.isAvailable;
    // Add other fields if present
  } catch (error) {
    console.error('Failed to load dashboard data', error);
    alert('Failed to load dashboard. Please refresh the page.');
  }
}

function displayDashboard() {
  loadDashboardData();
  showTab('profile');
}

function displayBookings(bookings) {
  const bookingsList = document.getElementById('bookings-list');
  bookingsList.innerHTML = '';
  bookings.forEach(b => {
    const div = document.createElement('div');
    div.className = 'tailor-card';
    div.innerHTML = `
      <p><strong>Customer:</strong> ${b.customerName}</p>
      <p><strong>Service:</strong> ${b.serviceType}</p>
      <p><strong>Date:</strong> ${b.preferredDate}</p>
      <p><strong>Status:</strong> <span class="status-${b.status}">${b.status}</span></p>
      ${b.status === 'pending' ? `
        <button class="btn" onclick="handleBooking(${b.id}, 'accept')">Accept</button>
        <button class="btn btn-secondary" onclick="handleBooking(${b.id}, 'reject')">Reject</button>
      ` : b.status === 'accepted' ? `
        <button class="btn" onclick="handleBooking(${b.id}, 'complete')">Complete</button>
      ` : ''}
    `;
    bookingsList.appendChild(div);
  });
}

function displayReviews(reviews) {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = '';
  reviews.forEach(r => {
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

async function handleBooking(bookingId, action) {
  const status = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'completed';
  try {
    const result = await apiService.post('update_booking.php', { id: bookingId, status: status });
    if (result.success) {
      if (action === 'complete') {
        // Update analytics
        loadDashboardData();
      } else {
        displayBookings(currentTailor.bookings); // Refresh bookings
      }
    } else {
      alert('Failed to update booking');
    }
  } catch (error) {
    alert('Error updating booking: ' + error.message);
  }
}

function displayAnalytics(analytics) {
  document.getElementById('total-bookings').textContent = analytics.totalBookings;
  document.getElementById('completed-bookings').textContent = analytics.completedBookings;
  document.getElementById('total-revenue').textContent = `₹${analytics.totalRevenue}`;
  // For chart, use analytics data if available, or fetch separately
  const ctx = document.getElementById('bookings-chart').getContext('2d');
  // Assume dates and data are in analytics or fetch
  // For now, placeholder
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Fill with data from backend
      datasets: [{
        label: 'Completed Bookings',
        data: [],
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
  window.location.href = 'logout.php';
}

function updateNav() {
  document.getElementById('login-link').style.display = currentUser ? 'none' : 'list-item';
  document.getElementById('logout-link').style.display = currentUser ? 'list-item' : 'none';
  document.getElementById('dashboard-link').style.display = currentUser && currentUser.role === 'tailor' ? 'list-item' : 'none';
}

// Initialize
updateNav();
if (window.currentUser && window.currentUser.role === 'tailor') {
  currentUser = window.currentUser;
  showSection('dashboard');
  loadDashboardData();
} else {
  showSection('home');
}
