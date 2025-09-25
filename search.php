<?php
require_once 'config.php';

header('Content-Type: application/json');

// Get search parameters
$query = $_GET['q'] ?? '';
$location = $_GET['location'] ?? '';
$specialty = $_GET['specialty'] ?? '';

try {
    $sql = "
        SELECT u.id, u.name, u.email, t.address, t.mobile, t.specialties, t.experience, t.rating, t.description, t.price_min, t.price_max, t.is_available
        FROM users u
        JOIN tailors t ON u.id = t.id
        WHERE u.role = 'tailor' AND t.is_available = 1
    ";
    $params = [];

    if (!empty($query)) {
        $sql .= " AND (u.name LIKE ? OR t.description LIKE ? OR t.specialties LIKE ?)";
        $searchTerm = "%$query%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if (!empty($location)) {
        $sql .= " AND t.address LIKE ?";
        $params[] = "%$location%";
    }

    if (!empty($specialty)) {
        $sql .= " AND t.specialties LIKE ?";
        $params[] = "%$specialty%";
    }

    $sql .= " ORDER BY t.rating DESC, t.experience DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $tailors = $stmt->fetchAll();

    // Format response
    $response = array_map(function($tailor) {
        return [
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
            'isAvailable' => (bool)$tailor['is_available'],
            'reviews' => [], // Will be populated separately if needed
            'totalBookings' => 0, // Will be calculated if needed
            'completedBookings' => 0, // Will be calculated if needed
            'joinedDate' => '', // Will be added if needed
            'lastActive' => '', // Will be added if needed
            'certifications' => [], // Will be added if needed
            'portfolio' => [], // Will be added if needed
            'socialMedia' => [] // Will be added if needed
        ];
    }, $tailors);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
