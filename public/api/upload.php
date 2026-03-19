<?php
// public/api/upload.php
require_once 'db.php';
require_once 'auth.php';

$uploadDir = __DIR__ . '/../uploads/';

// Ensure upload directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    requireAuth();
    $file = $_FILES['image'];
    
    // Check for errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'File upload error code: ' . $file['error']]);
        exit;
    }
    
    $fileInfo = pathinfo($file['name']);
    $ext = strtolower($fileInfo['extension']);
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    // Validate extension
    if (!in_array($ext, $allowedExts)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only images are allowed.']);
        exit;
    }
    
    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (strpos($mimeType, 'image/') !== 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file content.']);
        exit;
    }
    
    // Generate safe filename
    $baseName = preg_replace('/[^a-z0-9]/', '-', strtolower($fileInfo['filename']));
    $newName = time() . '-' . $baseName . '.' . $ext;
    $targetPath = $uploadDir . $newName;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode(['url' => '/uploads/' . $newName]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save uploaded file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or invalid request.']);
}
?>
