<?php
// public/api/projects.php
require_once 'db.php';
require_once 'auth.php';

// Prevent errors if running in a purely static context without DB setup initially
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not configured']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Helper to handle JSON decoding based on stored data type
function parseJsonField($value) {
    if (empty($value)) return [];
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

// Generate an ID similar to nanoid
function generateId($length = 10) {
    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    $id = '';
    for ($i = 0; $i < $length; $i++) {
        $id .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $id;
}

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        // Fetch single project
        $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            exit;
        }

        $row['tags'] = parseJsonField($row['tags']);
        $row['buttons'] = parseJsonField($row['buttons']);
        $row['links'] = parseJsonField($row['links']);
        $row['images'] = parseJsonField($row['images']);

        echo json_encode($row);
    } else {
        // Fetch all projects
        $stmt = $pdo->query('SELECT * FROM projects ORDER BY created_at DESC');
        $rows = $stmt->fetchAll();

        foreach ($rows as &$row) {
            $row['tags'] = parseJsonField($row['tags']);
            $row['buttons'] = parseJsonField($row['buttons']);
            $row['links'] = parseJsonField($row['links']);
            $row['images'] = parseJsonField($row['images']);
        }

        echo json_encode($rows);
    }
} elseif ($method === 'POST') {
    requireAuth();
    // Create new project
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    $id = isset($data['id']) ? $data['id'] : generateId();

    $stmt = $pdo->prepare('
        INSERT INTO projects (
            id, title, category, year, description, full_description,
            image_url, detail_image_url, tags, live_url, github_url,
            buttons, links, images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');

    $stmt->execute([
        $id,
        $data['title'] ?? '',
        $data['category'] ?? '',
        $data['year'] ?? '',
        $data['description'] ?? '',
        $data['fullDescription'] ?? '',
        $data['imageUrl'] ?? '',
        $data['detailImageUrl'] ?? '',
        json_encode($data['tags'] ?? []),
        $data['liveUrl'] ?? '',
        $data['githubUrl'] ?? '',
        json_encode($data['buttons'] ?? []),
        json_encode($data['links'] ?? []),
        json_encode($data['images'] ?? [])
    ]);

    // Fetch the inserted record to return it
    $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    
    $row['tags'] = parseJsonField($row['tags']);
    $row['buttons'] = parseJsonField($row['buttons']);
    $row['links'] = parseJsonField($row['links']);
    $row['images'] = parseJsonField($row['images']);

    http_response_code(201);
    echo json_encode($row);

} elseif ($method === 'PUT') {
    requireAuth();
    // Update existing project
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }
    
    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    $stmt = $pdo->prepare('
        UPDATE projects SET
            title = ?, category = ?, year = ?, description = ?, full_description = ?,
            image_url = ?, detail_image_url = ?, tags = ?, live_url = ?, github_url = ?,
            buttons = ?, links = ?, images = ?
        WHERE id = ?
    ');

    $stmt->execute([
        $data['title'] ?? '',
        $data['category'] ?? '',
        $data['year'] ?? '',
        $data['description'] ?? '',
        $data['fullDescription'] ?? '',
        $data['imageUrl'] ?? '',
        $data['detailImageUrl'] ?? '',
        json_encode($data['tags'] ?? []),
        $data['liveUrl'] ?? '',
        $data['githubUrl'] ?? '',
        json_encode($data['buttons'] ?? []),
        json_encode($data['links'] ?? []),
        json_encode($data['images'] ?? []),
        $id
    ]);

    if ($stmt->rowCount() === 0) {
        // Find if exists to return 200 basically or 404
        $checkStmt = $pdo->prepare('SELECT count(*) FROM projects WHERE id = ?');
        $checkStmt->execute([$id]);
        if ($checkStmt->fetchColumn() == 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            exit;
        }
    }

    $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    
    $row['tags'] = parseJsonField($row['tags']);
    $row['buttons'] = parseJsonField($row['buttons']);
    $row['links'] = parseJsonField($row['links']);
    $row['images'] = parseJsonField($row['images']);

    echo json_encode($row);

} elseif ($method === 'DELETE') {
    requireAuth();
    // Delete project
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$_GET['id']]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
