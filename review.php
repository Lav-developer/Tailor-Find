<?php
require_once 'config.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireLogin();

    $tailor_id = (int)($_POST['tailor_id'] ?? 0);
    $rating = (int)($_POST['rating'] ?? 0);
    $comment = sanitize($_POST['comment'] ?? '');

    // Validation
    if ($rating < 1 || $rating > 5) {
        $error = 'Rating must be between 1 and 5.';
    } elseif (empty($comment)) {
        $error = 'Comment is required.';
    } else {
        // Check if tailor exists
        $stmt = $pdo->prepare("SELECT id FROM tailors WHERE id = ?");
        $stmt->execute([$tailor_id]);
        if (!$stmt->fetch()) {
            $error = 'Invalid tailor selected.';
        } else {
            // Insert review
            $stmt = $pdo->prepare("INSERT INTO reviews (tailor_id, rating, comment) VALUES (?, ?, ?)");
            if ($stmt->execute([$tailor_id, $rating, $comment])) {
                // Update tailor rating
                $stmt = $pdo->prepare("
                    UPDATE tailors
                    SET rating = (SELECT AVG(rating) FROM reviews WHERE tailor_id = ?)
                    WHERE id = ?
                ");
                $stmt->execute([$tailor_id, $tailor_id]);

                $message = 'Review submitted successfully!';
            } else {
                $error = 'Review submission failed. Please try again.';
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
    <title>Review Submitted - TailorFind</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="review-confirmation">
            <?php if ($message): ?>
                <div class="success-message"><?php echo $message; ?></div>
                <a href="index.php" class="btn">Back to Home</a>
            <?php elseif ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
                <a href="index.php" class="btn">Back to Home</a>
            <?php else: ?>
                <p>Processing your review...</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
