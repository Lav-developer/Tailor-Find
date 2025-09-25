<section id="search" class="section">
  <div class="container">
    <h2>Find Your Perfect Tailor</h2>
    <p>Search by location, specialty, or tailor name</p>
    <div class="search-bar">
      <input type="text" id="search-input" placeholder="Search tailors...">
      <select id="specialty-filter">
        <option value="">All Specialties</option>
        <option value="Custom Suits">Custom Suits</option>
        <option value="Alterations">Alterations</option>
        <option value="Traditional Wear">Traditional Wear</option>
        <option value="Formal Wear">Formal Wear</option>
        <option value="Casual Wear">Casual Wear</option>
        <option value="Repairs">Repairs</option>
      </select>
      <select id="location-filter">
        <option value="">All Locations</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Chennai">Chennai</option>
        <option value="Kolkata">Kolkata</option>
      </select>
      <select id="rating-filter">
        <option value="">All Ratings</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
        <option value="2">2+ Stars</option>
      </select>
      <select id="price-filter">
        <option value="">All Prices</option>
        <option value="budget">Budget (₹500-1500)</option>
        <option value="midrange">Mid-range (₹1500-3000)</option>
        <option value="premium">Premium (₹3000+)</option>
      </select>
      <button class="btn search-btn" onclick="searchTailors()">Search</button>
    </div>
    <div class="tailor-grid" id="tailor-grid"></div>
  </div>
</section>
