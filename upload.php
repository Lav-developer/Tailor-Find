<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isTailor()) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$user_id = getCurrentUserId();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitize($_POST['title'] ?? '');

    if (empty($title)) {
        echo json_encode(['error' => 'Title is required']);
        exit();
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Image upload failed']);
        exit();
    }

    $file = $_FILES['image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    $max_size = 5 * 1024 * 1024; // 5MB

    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, and GIF are allowed.']);
        exit();
    }

    if ($file['size'] > $max_size) {
        echo json_encode(['error' => 'File size too large. Maximum 5MB allowed.']);
        exit();
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = 'uploads/portfolio/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('portfolio_') . '.' . $extension;
    $filepath = $upload_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Save to database
        $stmt = $pdo->prepare("INSERT INTO portfolio (tailor_id, title, image_path) VALUES (?, ?, ?)");
        if ($stmt->execute([$user_id, $title, $filepath])) {
            echo json_encode([
                'success' => true,
                'id' => $pdo->lastInsertId(),
                'title' => $title,
                'imagePath' => $filepath
            ]);
        } else {
            unlink($filepath); // Delete uploaded file if DB insert fails
            echo json_encode(['error' => 'Database error']);
        }
    } else {
        echo json_encode(['error' => 'File upload failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
