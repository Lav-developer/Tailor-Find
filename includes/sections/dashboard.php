<section id="dashboard" class="section">
  <div class="container">
    <h2>Tailor Dashboard</h2>
    <div class="tabs">
      <button class="tab active" onclick="showTab('profile')">Profile</button>
      <button class="tab" onclick="showTab('bookings')">Bookings</button>
      <button class="tab" onclick="showTab('portfolio')">Portfolio</button>
      <button class="tab" onclick="showTab('reviews')">Reviews</button>
      <button class="tab" onclick="showTab('analytics')">Analytics</button>
    </div>
    <div id="profile-tab" class="tab-content">
      <form id="profile-form" action="profile_update.php" method="POST">
        <div class="form-group">
          <label for="profile-name">Full Name</label>
          <input type="text" id="profile-name" name="name">
        </div>
        <div class="form-group">
          <label for="profile-mobile">Mobile Number</label>
          <input type="tel" id="profile-mobile" name="mobile">
        </div>
        <div class="form-group">
          <label for="profile-address">Address</label>
          <textarea id="profile-address" name="address"></textarea>
        </div>
        <div class="form-group">
          <label for="profile-specialties">Specialties (comma-separated)</label>
          <input type="text" id="profile-specialties" name="specialties">
        </div>
        <div class="form-group">
          <label for="profile-availability">Available for bookings</label>
          <input type="checkbox" id="profile-availability" name="availability">
        </div>
        <button type="submit" class="btn">Save Changes</button>
      </form>
    </div>
    <div id="bookings-tab" class="tab-content">
      <div id="bookings-list"></div>
    </div>
    <div id="portfolio-tab" class="tab-content">
      <div class="form-group">
        <label for="portfolio-image">Upload Portfolio Image</label>
        <input type="file" id="portfolio-image" accept="image/*">
        <input type="text" id="portfolio-title" placeholder="Portfolio Item Title">
        <button class="btn" onclick="addPortfolioItem()">Add Portfolio Item</button>
      </div>
      <div id="portfolio-list" class="tailor-grid"></div>
    </div>
    <div id="reviews-tab" class="tab-content">
      <div id="reviews-list"></div>
    </div>
    <div id="analytics-tab" class="tab-content">
      <div class="analytics-card">
        <h3>Total Bookings</h3>
        <p id="total-bookings">0</p>
      </div>
      <div class="analytics-card">
        <h3>Completed Jobs</h3>
        <p id="completed-bookings">0</p>
      </div>
      <div class="analytics-card">
        <h3>Total Revenue</h3>
        <p id="total-revenue">₹0</p>
      </div>
      <div class="analytics-card">
        <h3>Bookings Trend</h3>
        <canvas id="bookings-chart"></canvas>
      </div>
    </div>
  </div>
</section>
