<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TailorFind</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<?php include 'config.php'; ?>
<?php include 'includes/header.php'; ?>

  <main>
    <?php include 'includes/sections/home.php'; ?>
    <?php include 'includes/sections/search.php'; ?>
    <?php include 'includes/sections/services.php'; ?>
    <?php include 'includes/sections/about.php'; ?>
    <?php include 'includes/sections/register.php'; ?>
    <?php include 'includes/sections/dashboard.php'; ?>
    <?php include 'includes/modals.php'; ?>
  </main>

  <?php include 'includes/footer.php'; ?>

  <script src="script.js"></script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9562a05a9e7f8ad5',t:'MTc1MTAwMzAwMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>