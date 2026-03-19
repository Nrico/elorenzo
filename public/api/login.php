<?php
// public/api/login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// TODO: Change this to your desired secure passphrase
$CORRECT_PASSPHRASE = 'highdesert';

$data = json_decode(file_get_contents('php://input'), true);
$passphrase = isset($data['passphrase']) ? trim($data['passphrase']) : '';

if ($passphrase === $CORRECT_PASSPHRASE) {
    // Generate a simple secure token based on the passphrase
    $token = hash('sha256', $CORRECT_PASSPHRASE . 'elorenzo_salt_2024');
    echo json_encode(['success' => true, 'token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid passphrase']);
}
?>
