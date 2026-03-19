<?php
// public/api/journal.php
require_once 'db.php';
require_once 'auth.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not configured']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function parseJsonField($value) {
    if (empty($value)) return [];
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

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
        $stmt = $pdo->prepare('SELECT * FROM journal_posts WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            exit;
        }

        $row['blocks'] = parseJsonField($row['blocks']);
        $row['tags'] = parseJsonField($row['tags'] ?? '[]');
        // Cast tinyint to boolean
        $row['published'] = (bool)$row['published'];
        echo json_encode($row);
    } else {
        $includeDrafts = isset($_GET['all']) && $_GET['all'] === 'true';
        
        if ($includeDrafts && isAuthenticated()) {
            $stmt = $pdo->query('SELECT * FROM journal_posts ORDER BY created_at DESC');
        } else {
            $stmt = $pdo->query('SELECT * FROM journal_posts WHERE published = 1 ORDER BY published_at DESC');
        }
        
        $rows = $stmt->fetchAll();

        foreach ($rows as &$row) {
            $row['blocks'] = parseJsonField($row['blocks']);
            $row['tags'] = parseJsonField($row['tags'] ?? '[]');
            $row['published'] = (bool)$row['published'];
        }

        echo json_encode($rows);
    }
} elseif ($method === 'POST') {
    requireAuth();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    $id = isset($data['id']) ? $data['id'] : generateId();
    $published = isset($data['published']) && $data['published'] ? 1 : 0;
    
    // Set published_at if publishing for the first time
    $publishedAt = $published ? date('Y-m-d H:i:s') : null;

    $stmt = $pdo->prepare('
        INSERT INTO journal_posts (
            id, title, cover_image_url, excerpt, tags, blocks, published, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ');

    $stmt->execute([
        $id,
        $data['title'] ?? 'Untitled',
        $data['cover_image_url'] ?? '',
        $data['excerpt'] ?? '',
        json_encode($data['tags'] ?? []),
        json_encode($data['blocks'] ?? []),
        $published,
        $publishedAt
    ]);

    $stmt = $pdo->prepare('SELECT * FROM journal_posts WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    
    $row['blocks'] = parseJsonField($row['blocks']);
    $row['tags'] = parseJsonField($row['tags'] ?? '[]');
    $row['published'] = (bool)$row['published'];

    http_response_code(201);
    echo json_encode($row);

} elseif ($method === 'PUT') {
    requireAuth();
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

    $published = isset($data['published']) && $data['published'] ? 1 : 0;

    // Check if we need to set published_at
    $checkStmt = $pdo->prepare('SELECT published, published_at FROM journal_posts WHERE id = ?');
    $checkStmt->execute([$id]);
    $current = $checkStmt->fetch();
    
    $publishedAt = $current['published_at'];
    if ($published && !$current['published']) {
        $publishedAt = date('Y-m-d H:i:s'); // Just published
    }

    $stmt = $pdo->prepare('
        UPDATE journal_posts SET
            title = ?, cover_image_url = ?, excerpt = ?, tags = ?, blocks = ?, published = ?, published_at = ?
        WHERE id = ?
    ');

    $stmt->execute([
        $data['title'] ?? 'Untitled',
        $data['cover_image_url'] ?? '',
        $data['excerpt'] ?? '',
        json_encode($data['tags'] ?? []),
        json_encode($data['blocks'] ?? []),
        $published,
        $publishedAt,
        $id
    ]);

    $stmt = $pdo->prepare('SELECT * FROM journal_posts WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    
    $row['blocks'] = parseJsonField($row['blocks']);
    $row['tags'] = parseJsonField($row['tags'] ?? '[]');
    $row['published'] = (bool)$row['published'];

    echo json_encode($row);

} elseif ($method === 'DELETE') {
    requireAuth();
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM journal_posts WHERE id = ?');
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
