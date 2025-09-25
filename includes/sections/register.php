<section id="register" class="section">
  <div class="container">
    <div class="register-form">
      <h2>Join TailorFind as a Professional</h2>
      <p>Grow your tailoring business with our platform</p>
      <form id="register-form" action="register.php" method="POST">
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" name="name" required>
          <span class="error" id="reg-name-error"></span>
        </div>
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input type="email" id="reg-email" name="email" required>
          <span class="error" id="reg-email-error"></span>
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" name="password" required>
          <span class="error" id="reg-password-error"></span>
        </div>
        <div class="form-group">
          <label for="reg-mobile">Mobile Number</label>
          <input type="tel" id="reg-mobile" name="mobile" required>
          <span class="error" id="reg-mobile-error"></span>
        </div>
        <div class="form-group">
          <label for="reg-address">Address</label>
          <textarea id="reg-address" name="address" required></textarea>
        </div>
        <div class="form-group">
          <label for="reg-specialties">Specialties (comma-separated)</label>
          <input type="text" id="reg-specialties" name="specialties" required>
        </div>
        <div class="form-group">
          <label for="reg-experience">Years of Experience</label>
          <input type="number" id="reg-experience" name="experience" required>
        </div>
        <button type="submit" class="btn">Register as Tailor</button>
      </form>
    </div>
  </div>
</section>
