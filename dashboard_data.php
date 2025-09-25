<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isTailor()) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$user_id = getCurrentUserId();

try {
    // Get tailor profile
    $stmt = $pdo->prepare("
        SELECT u.name, u.email, t.*
        FROM users u
        JOIN tailors t ON u.id = t.id
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $tailor = $stmt->fetch();

    if (!$tailor) {
        http_response_code(404);
        echo json_encode(['error' => 'Tailor not found']);
        exit();
    }

    // Get bookings
    $stmt = $pdo->prepare("
        SELECT id, customer_name, customer_email, customer_mobile, service_type, preferred_date, description, status, created_at
        FROM bookings
        WHERE tailor_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user_id]);
    $bookings = $stmt->fetchAll();

    // Get reviews
    $stmt = $pdo->prepare("
        SELECT id, rating, comment, created_at
        FROM reviews
        WHERE tailor_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user_id]);
    $reviews = $stmt->fetchAll();

    // Get portfolio
    $stmt = $pdo->prepare("
        SELECT id, title, image_path, created_at
        FROM portfolio
        WHERE tailor_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user_id]);
    $portfolio = $stmt->fetchAll();

    // Calculate analytics
    $totalBookings = count($bookings);
    $completedBookings = count(array_filter($bookings, function($b) { return $b['status'] === 'completed'; }));
    $totalRevenue = $completedBookings * 2500; // Assuming average price

    // Format response
    $response = [
        'profile' => [
            'id' => $tailor['id'],
            'name' => $tailor['name'],
            'email' => $tailor['email'],
            'address' => $tailor['address'],
            'mobile' => $tailor['mobile'],
            'specialties' => explode(',', $tailor['specialties']),
            'experience' => $tailor['experience'],
            'rating' => (float)$tailor['rating'],
            'description' => $tailor['description'],
            'priceRange' => [
                'min' => (int)$tailor['price_min'],
                'max' => (int)$tailor['price_max']
            ],
            'workingHours' => [
                'start' => $tailor['working_hours_start'],
                'end' => $tailor['working_hours_end']
            ],
            'isAvailable' => (bool)$tailor['is_available'],
            'totalBookings' => $totalBookings,
            'completedBookings' => $completedBookings,
            'joinedDate' => $tailor['joined_date'],
            'lastActive' => $tailor['last_active']
        ],
        'bookings' => array_map(function($b) {
            return [
                'id' => $b['id'],
                'customerName' => $b['customer_name'],
                'customerEmail' => $b['customer_email'],
                'customerMobile' => $b['customer_mobile'],
                'serviceType' => $b['service_type'],
                'preferredDate' => $b['preferred_date'],
                'description' => $b['description'],
                'status' => $b['status'],
                'createdAt' => $b['created_at']
            ];
        }, $bookings),
        'reviews' => array_map(function($r) {
            return [
                'id' => $r['id'],
                'rating' => $r['rating'],
                'comment' => $r['comment'],
                'date' => $r['created_at']
            ];
        }, $reviews),
        'portfolio' => array_map(function($p) {
            return [
                'id' => $p['id'],
                'title' => $p['title'],
                'imagePath' => $p['image_path'],
                'createdAt' => $p['created_at']
            ];
        }, $portfolio),
        'analytics' => [
            'totalBookings' => $totalBookings,
            'completedBookings' => $completedBookings,
            'totalRevenue' => $totalRevenue,
            'averageRating' => (float)$tailor['rating']
        ]
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
