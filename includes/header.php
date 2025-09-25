<header>
  <div class="container header-content">
    <div class="logo">TailorFind</div>
    <nav>
      <ul>
        <li><a href="#" onclick="showSection('home')">Home</a></li>
        <li><a href="#" onclick="showSection('search')">Find Tailors</a></li>
        <li><a href="#" onclick="showSection('services')">Services</a></li>
        <li><a href="#" onclick="showSection('about')">About</a></li>
        <li><a href="#" onclick="showSection('register')">Join as Tailor</a></li>
        <?php if (isTailor()): ?>
          <li id="dashboard-link"><a href="#" onclick="showSection('dashboard')">Dashboard</a></li>
        <?php endif; ?>
        <?php if (!isLoggedIn()): ?>
          <li id="login-link"><a href="#" onclick="showLoginModal()">Login</a></li>
        <?php else: ?>
          <li id="logout-link"><a href="#" onclick="logout()">Logout</a></li>
        <?php endif; ?>
      </ul>
    </nav>
  </div>
</header>
