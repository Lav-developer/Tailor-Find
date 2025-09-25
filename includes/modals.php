<div id="booking-modal" class="modal">
  <div class="modal-content">
    <h2>Book a Tailor</h2>
    <form id="booking-form" action="booking.php" method="POST">
      <input type="hidden" id="booking-tailor-id" name="tailor_id">
      <div class="form-group">
        <label for="booking-name">Your Name</label>
        <input type="text" id="booking-name" name="name" required>
        <span class="error" id="booking-name-error"></span>
      </div>
      <div class="form-group">
        <label for="booking-email">Your Email</label>
        <input type="email" id="booking-email" name="email" required>
        <span class="error" id="booking-email-error"></span>
      </div>
      <div class="form-group">
        <label for="booking-mobile">Your Mobile</label>
        <input type="tel" id="booking-mobile" name="mobile" required>
        <span class="error" id="booking-mobile-error"></span>
      </div>
      <div class="form-group">
        <label for="booking-service">Service Type</label>
        <select id="booking-service" name="service" required></select>
      </div>
      <div class="form-group">
        <label for="booking-date">Preferred Date</label>
        <input type="date" id="booking-date" name="date" required>
      </div>
      <div class="form-group">
        <label for="booking-description">Description</label>
        <textarea id="booking-description" name="description"></textarea>
      </div>
      <button type="submit" class="btn">Submit Booking</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal('booking-modal')">Cancel</button>
    </form>
  </div>
</div>

<div id="login-modal" class="modal">
  <div class="modal-content">
    <h2>Login to TailorFind</h2>
    <form id="login-form" action="login.php" method="POST">
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" name="email" required>
        <span class="error" id="login-email-error"></span>
      </div>
      <div class="form-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" name="password" required>
        <span class="error" id="login-password-error"></span>
      </div>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
</div>

<div id="review-modal" class="modal">
  <div class="modal-content">
    <h2>Submit Review</h2>
    <form id="review-form" action="review.php" method="POST">
      <input type="hidden" id="review-tailor-id" name="tailor_id">
      <div class="form-group">
        <label for="review-rating">Rating</label>
        <select id="review-rating" name="rating" required>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <div class="form-group">
        <label for="review-comment">Comment</label>
        <textarea id="review-comment" name="comment" required></textarea>
      </div>
      <button type="submit" class="btn">Submit Review</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal('review-modal')">Cancel</button>
    </form>
  </div>
</div>
