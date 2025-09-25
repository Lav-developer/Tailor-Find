<?php
require_once 'config.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireLogin();

    $tailor_id = (int)($_POST['tailor_id'] ?? 0);
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $mobile = sanitize($_POST['mobile'] ?? '');
    $service = sanitize($_POST['service'] ?? '');
    $date = $_POST['date'] ?? '';
    $description = sanitize($_POST['description'] ?? '');

    // Validation
    if (empty($name) || empty($email) || empty($mobile) || empty($service) || empty($date)) {
        $error = 'All required fields must be filled.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email format.';
    } elseif (!preg_match('/^[0-9]{10}$/', $mobile)) {
        $error = 'Mobile number must be 10 digits.';
    } elseif (strtotime($date) < strtotime('today')) {
        $error = 'Preferred date cannot be in the past.';
    } else {
        // Check if tailor exists
        $stmt = $pdo->prepare("SELECT id FROM tailors WHERE id = ?");
        $stmt->execute([$tailor_id]);
        if (!$stmt->fetch()) {
            $error = 'Invalid tailor selected.';
        } else {
            // Insert booking
            $stmt = $pdo->prepare("INSERT INTO bookings (tailor_id, customer_name, customer_email, customer_mobile, service_type, preferred_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            if ($stmt->execute([$tailor_id, $name, $email, $mobile, $service, $date, $description])) {
                // Update tailor total bookings
                $stmt = $pdo->prepare("UPDATE tailors SET total_bookings = total_bookings + 1 WHERE id = ?");
                $stmt->execute([$tailor_id]);

                $message = 'Booking submitted successfully! The tailor will contact you soon.';
            } else {
                $error = 'Booking submission failed. Please try again.';
            }
        }
    }
} else {
    // Redirect if not logged in
    requireLogin();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Submitted - TailorFind</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="booking-confirmation">
            <?php if ($message): ?>
                <div class="success-message"><?php echo $message; ?></div>
                <a href="index.php" class="btn">Back to Home</a>
            <?php elseif ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
                <a href="index.php" class="btn">Back to Home</a>
            <?php else: ?>
                <p>Processing your booking...</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
