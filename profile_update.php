<?php
require_once 'config.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireTailor();

    $user_id = getCurrentUserId();
    $name = sanitize($_POST['name'] ?? '');
    $address = sanitize($_POST['address'] ?? '');
    $mobile = sanitize($_POST['mobile'] ?? '');
    $specialties = sanitize($_POST['specialties'] ?? '');
    $experience = (int)($_POST['experience'] ?? 0);
    $description = sanitize($_POST['description'] ?? '');
    $price_min = (int)($_POST['price_min'] ?? 0);
    $price_max = (int)($_POST['price_max'] ?? 0);
    $working_hours_start = $_POST['working_hours_start'] ?? '09:00';
    $working_hours_end = $_POST['working_hours_end'] ?? '18:00';
    $is_available = isset($_POST['is_available']) ? 1 : 0;

    // Validation
    if (empty($name) || empty($address) || empty($mobile)) {
        $error = 'Name, address, and mobile are required.';
    } elseif (!preg_match('/^[0-9]{10}$/', $mobile)) {
        $error = 'Mobile number must be 10 digits.';
    } elseif ($price_min < 0 || $price_max < 0 || $price_min > $price_max) {
        $error = 'Invalid price range.';
    } else {
        // Update user name
        $stmt = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
        $stmt->execute([$name, $user_id]);

        // Update tailor profile
        $stmt = $pdo->prepare("
            UPDATE tailors SET
                address = ?, mobile = ?, specialties = ?, experience = ?,
                description = ?, price_min = ?, price_max = ?,
                working_hours_start = ?, working_hours_end = ?, is_available = ?
            WHERE id = ?
        ");
        if ($stmt->execute([$address, $mobile, $specialties, $experience, $description, $price_min, $price_max, $working_hours_start, $working_hours_end, $is_available, $user_id])) {
            $message = 'Profile updated successfully!';
            // Update session name
            $_SESSION['user_name'] = $name;
        } else {
            $error = 'Profile update failed. Please try again.';
        }
    }
} else {
    // Redirect if not tailor
    requireTailor();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Updated - TailorFind</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="profile-update-confirmation">
            <?php if ($message): ?>
                <div class="success-message"><?php echo $message; ?></div>
                <a href="index.php?section=dashboard" class="btn">Back to Dashboard</a>
            <?php elseif ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
                <a href="index.php?section=dashboard" class="btn">Back to Dashboard</a>
            <?php else: ?>
                <p>Processing your profile update...</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
